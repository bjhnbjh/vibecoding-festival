-- 기존 festivals 정책 삭제
DROP POLICY IF EXISTS "Authenticated users can insert festivals" ON public.festivals;
DROP POLICY IF EXISTS "Authenticated users can update festivals" ON public.festivals;
DROP POLICY IF EXISTS "Authenticated users can delete festivals" ON public.festivals;

-- festivals 테이블에 created_by 컬럼 추가 (어느 관리자가 등록했는지 추적)
ALTER TABLE public.festivals
ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id);

-- 새로운 role 기반 정책 생성

-- 삽입: university_admin 이상만 가능, university 필드는 자기 학교로 제한 (super_admin 제외)
CREATE POLICY "University admins can insert festivals"
ON public.festivals FOR INSERT
WITH CHECK (
  -- 대학 관리자 이상이어야 함
  (
    SELECT (raw_user_meta_data->>'role') IN ('university_admin', 'super_admin')
    FROM auth.users
    WHERE id = auth.uid()
  )
  AND
  -- 대학 관리자는 자기 학교만, 최고 관리자는 모든 학교 가능
  (
    (
      SELECT raw_user_meta_data->>'role'
      FROM auth.users
      WHERE id = auth.uid()
    ) = 'super_admin'
    OR
    university = (
      SELECT raw_user_meta_data->>'university'
      FROM auth.users
      WHERE id = auth.uid()
    )
  )
);

-- 수정: university_admin 이상만 가능, university 필드는 자기 학교로 제한 (super_admin 제외)
CREATE POLICY "University admins can update their university festivals"
ON public.festivals FOR UPDATE
USING (
  -- 대학 관리자 이상이어야 함
  (
    SELECT (raw_user_meta_data->>'role') IN ('university_admin', 'super_admin')
    FROM auth.users
    WHERE id = auth.uid()
  )
  AND
  -- 대학 관리자는 자기 학교만, 최고 관리자는 모든 학교 가능
  (
    (
      SELECT raw_user_meta_data->>'role'
      FROM auth.users
      WHERE id = auth.uid()
    ) = 'super_admin'
    OR
    university = (
      SELECT raw_user_meta_data->>'university'
      FROM auth.users
      WHERE id = auth.uid()
    )
  )
)
WITH CHECK (
  -- 수정 시에도 university가 자기 학교여야 함
  (
    SELECT raw_user_meta_data->>'role'
    FROM auth.users
    WHERE id = auth.uid()
  ) = 'super_admin'
  OR
  university = (
    SELECT raw_user_meta_data->>'university'
    FROM auth.users
    WHERE id = auth.uid()
  )
);

-- 삭제: university_admin 이상만 가능, university 필드는 자기 학교로 제한 (super_admin 제외)
CREATE POLICY "University admins can delete their university festivals"
ON public.festivals FOR DELETE
USING (
  -- 대학 관리자 이상이어야 함
  (
    SELECT (raw_user_meta_data->>'role') IN ('university_admin', 'super_admin')
    FROM auth.users
    WHERE id = auth.uid()
  )
  AND
  -- 대학 관리자는 자기 학교만, 최고 관리자는 모든 학교 가능
  (
    (
      SELECT raw_user_meta_data->>'role'
      FROM auth.users
      WHERE id = auth.uid()
    ) = 'super_admin'
    OR
    university = (
      SELECT raw_user_meta_data->>'university'
      FROM auth.users
      WHERE id = auth.uid()
    )
  )
);

COMMENT ON COLUMN public.festivals.created_by IS '축제를 등록한 관리자 ID';
