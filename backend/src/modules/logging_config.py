import logging
import re
from datetime import datetime


class MultipleColorSQLFormatter(logging.Formatter):
    # ANSI 색상 상수 (터미널용)
    GRAY = "\033[90m"
    BLUE = "\033[34m"
    GREEN = "\033[92m"
    YELLOW = "\033[93m"
    RED = "\033[91m"
    CYAN = "\033[96m"
    MAGENTA = "\033[95m"
    BOLD = "\033[1m"
    RESET = "\033[0m"

    # SQL 키워드별 고유 색상 매핑
    SQL_COLORS = {
        "SELECT": CYAN,
        "GET": CYAN,
        "INSERT": GREEN,
        "POST": GREEN,
        "PATCH": YELLOW,
        "UPDATE": YELLOW,
        "DELETE": RED,
        "BEGIN": MAGENTA,
        "COMMIT": MAGENTA,
        "ROLLBACK": RED,
        "INFO": BOLD,
        "IN": BLUE,
        "AS": BLUE,
        "ON": BLUE,
        "FROM": BLUE,
        "WHERE": BLUE,
        "RETURNING": MAGENTA,
    }

    def format(self, record):
        # 1. hh:mm:ss 시간 추출 및 GRAY 색상 적용
        time_str = datetime.fromtimestamp(record.created).strftime("%H:%M:%S")
        colored_time = f"{self.GRAY}[{time_str}]{self.RESET}"

        # 2. 메시지 가져오기
        message = record.getMessage()

        # 3. [raw sql], [generated in...] 등 대괄호([]) 안의 내용 삭제
        # 대괄호로 시작해서 대괄호로 끝나는 패턴을 찾아 빈 문자열로 대체
        message = re.sub(r"\[.*?\]", "", message).strip()

        # 만약 대괄호를 지웠더니 메시지가 비어있다면 출력하지 않음 (None 방지)
        if not message:
            return ""

        # 4. SQL 키워드 색상 적용
        def colorize_sql(match):
            word = match.group(0).upper()
            color = self.SQL_COLORS.get(word, "")
            return f"{color}{word}{self.RESET}"

        sql_keywords = "|".join(self.SQL_COLORS.keys())
        message = re.sub(
            rf"\b({sql_keywords})\b", colorize_sql, message, flags=re.IGNORECASE
        )

        # 5. HTTP 상태 코드 색상 적용 (2xx: Green, 4xx: Yellow, 5xx: Red)
        def colorize_status(match):
            status = match.group(0)
            if status.startswith("2"):
                color = self.GREEN
            elif status.startswith("4"):
                color = self.YELLOW
            elif status.startswith("5"):
                color = self.RED
            else:
                color = ""
            return f"{color}{self.BOLD}{status}{self.RESET}\n"

        message = re.sub(r"\b(20[0-9]|40[0-9]|50[0-9])\b", colorize_status, message)

        # 최종 출력 (sqlalchemy.engine.Engine 문구는 %(name)s를 안 써서 생략됨)
        return f"{colored_time} {message}"


def configure_sqlalchemy_logger():
    logger = logging.getLogger("sqlalchemy.engine")
    logger.handlers.clear()

    handler = logging.StreamHandler()
    handler.setFormatter(MultipleColorSQLFormatter())

    logger.addHandler(handler)
    logger.setLevel(logging.INFO)
    logger.propagate = False

    # Uvicorn(FastAPI) 로그에도 적용
    uvicorn_logger = logging.getLogger("uvicorn.access")
    uvicorn_logger.handlers.clear()
    uvicorn_logger.addHandler(handler)
