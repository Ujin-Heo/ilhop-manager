# psql 사용법

psql은 PostgreSQL DB 서버에 접속하기 위한 클라이언트 프로그램입니다.

## 특정 사용자로 접속하기

```bash
psql -U 사용자명 -d ilhop_db -h localhost -W
```

# 주요 명령어

- `\l` 생성된 모든 데이터베이스 목록 확인
- `\c [DB이름]` 특정 데이터베이스로 연결 변경 (Connect)
- `\dt` 현재 DB의 테이블 목록 확인 (Display Tables)
- `\d [테이블명]` "특정 테이블의 상세 구조(컬럼, 타입 등) 확인"
- `\du` 사용자(Role) 목록 및 권한 확인
- `\q` psql 종료
