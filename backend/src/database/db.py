from sqlalchemy import select, delete
from sqlalchemy.orm import Session

from .models import Board, Article

board_infos = [
    {"name": "공지사항", "link": "https://www.example.com/announcement"},
    {"name": "채용공고", "link": "https://www.example.com/jobs"},
]


def initialize_boards(db: Session):
    db.execute(delete(Board))
    db.execute(delete(Article))
    for name, link in board_infos:
        db.add(Board(name=name, link=link))
    db.commit()


def get_board_by_name(db: Session, name: str) -> Board | None:
    stmt = select(Board).where(Board.name == name)
    return db.scalars(stmt).first()
