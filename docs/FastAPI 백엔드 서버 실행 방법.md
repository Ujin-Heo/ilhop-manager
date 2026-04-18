# FastAPI 백엔드 서버 실행 방법

## 디렉토리 구조

```bash
/backend(아래의 명령어를 실행할 위치)
├── README.md
│   └── main.cpython-312.pyc
├── main.py
├── pyproject.toml
├── src
│   ├── __init__.py
│   ├── app.py
│   ├── database
│   ├── modules
│   ├── routes
│   └── schemas
└── uv.lock
```

## FastAPI CLI를 사용하는 방법

```bash
fastapi dev src/app.py
```

## Uvicorn을 사용하는 방법

```bash
uvicorn src.app:app --reload
```

## main.py를 직접 실행하는 방법

```bash
python3 main.py
```
