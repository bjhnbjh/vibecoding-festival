-- 사용자 역할 시스템 추가
-- Role types: super_admin, university_admin, user

-- users 테이블에 role 컬럼 추가
ALTER TABLE auth.users
ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'user'
CHECK (role IN ('super_admin', 'university_admin', 'user'));

-- user_metadata에 role 정보 저장하기 위한 함수
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS TRIGGER AS $$
BEGIN
  -- 새 사용자 생성 시 기본적으로 user 역할 부여
  -- raw_user_meta_data에서 role을 읽어와서 설정
  IF NEW.raw_user_meta_data->>'role' IS NOT NULL THEN
    NEW.raw_user_meta_data = jsonb_set(
      COALESCE(NEW.raw_user_meta_data, '{}'::jsonb),
      '{role}',
      to_jsonb(NEW.raw_user_meta_data->>'role')
    );
  ELSE
    NEW.raw_user_meta_data = jsonb_set(
      COALESCE(NEW.raw_user_meta_data, '{}'::jsonb),
      '{role}',
      '"user"'::jsonb
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 트리거 생성 (이미 존재하면 삭제 후 재생성)
DROP TRIGGER IF EXISTS on_auth_user_created_role ON auth.users;
CREATE TRIGGER on_auth_user_created_role
  BEFORE INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_role();

-- 기존 사용자들에게 기본 role 설정
UPDATE auth.users
SET raw_user_meta_data = jsonb_set(
  COALESCE(raw_user_meta_data, '{}'::jsonb),
  '{role}',
  '"user"'::jsonb
)
WHERE raw_user_meta_data->>'role' IS NULL;

-- 역할 확인 헬퍼 함수들
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT (raw_user_meta_data->>'role') = 'super_admin'
    FROM auth.users
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_university_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT (raw_user_meta_data->>'role') IN ('university_admin', 'super_admin')
    FROM auth.users
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS TEXT AS $$
BEGIN
  RETURN (
    SELECT raw_user_meta_data->>'role'
    FROM auth.users
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.get_user_university()
RETURNS TEXT AS $$
BEGIN
  RETURN (
    SELECT raw_user_meta_data->>'university'
    FROM auth.users
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.is_super_admin IS '현재 사용자가 최고 관리자인지 확인';
COMMENT ON FUNCTION public.is_university_admin IS '현재 사용자가 대학 관리자 이상인지 확인';
COMMENT ON FUNCTION public.get_user_role IS '현재 사용자의 역할 반환';
COMMENT ON FUNCTION public.get_user_university IS '현재 사용자의 대학 정보 반환';
