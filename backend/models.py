from __future__ import annotations

import json
from datetime import datetime, timezone
from threading import RLock
from typing import Any

try:
    import pyodbc
except Exception:  # pragma: no cover
    pyodbc = None
try:
    import pymysql
except Exception:  # pragma: no cover
    pymysql = None


class Database:
    def __init__(
        self,
        mysql_host: str = "",
        mysql_port: int = 3306,
        mysql_user: str = "",
        mysql_password: str = "",
        mysql_db: str = "",
        sqlserver_host: str = "",
        sqlserver_port: int = 1433,
        sqlserver_user: str = "",
        sqlserver_password: str = "",
        sqlserver_db: str = "",
        sqlserver_driver: str = "ODBC Driver 18 for SQL Server",
        **_: Any,
    ):
        self.mysql_host = mysql_host
        self.mysql_port = mysql_port
        self.mysql_user = mysql_user
        self.mysql_password = mysql_password
        self.mysql_db = mysql_db
        self.sqlserver_host = sqlserver_host
        self.sqlserver_port = sqlserver_port
        self.sqlserver_user = sqlserver_user
        self.sqlserver_password = sqlserver_password
        self.sqlserver_db = sqlserver_db
        self.sqlserver_driver = sqlserver_driver

        self.mode = "none"
        self.conn = None
        self._db_lock = RLock()

        if self._connect_sqlserver():
            return
        self._connect_mysql()

    def _connect_sqlserver(self) -> bool:
        if (
            pyodbc is not None
            and self.sqlserver_host
            and self.sqlserver_user
            and self.sqlserver_password
            and self.sqlserver_db
        ):
            try:
                conn_str = (
                    f"DRIVER={{{self.sqlserver_driver}}};"
                    f"SERVER={self.sqlserver_host},{self.sqlserver_port};"
                    f"DATABASE={self.sqlserver_db};"
                    f"UID={self.sqlserver_user};"
                    f"PWD={self.sqlserver_password};"
                    "Encrypt=yes;TrustServerCertificate=yes;"
                )
                self.conn = pyodbc.connect(conn_str, autocommit=True)
                self.mode = "sqlserver"
                self._ensure_tables()
                return True
            except Exception:
                self.mode = "none"
                self.conn = None
        return False

    def _connect_mysql(self) -> bool:
        if (
            pymysql is not None
            and self.mysql_host
            and self.mysql_user
            and self.mysql_db
        ):
            try:
                self.conn = pymysql.connect(
                    host=self.mysql_host,
                    port=self.mysql_port,
                    user=self.mysql_user,
                    password=self.mysql_password,
                    database=self.mysql_db,
                    autocommit=True,
                    charset="utf8mb4",
                )
                self.mode = "mysql"
                self._ensure_tables_mysql()
                return True
            except Exception:
                self.mode = "none"
                self.conn = None
        return False

    def _ensure_connection(self) -> bool:
        if self.mode == "sqlserver" and self.conn:
            try:
                cursor = self.conn.cursor()
                cursor.execute("SELECT 1")
                cursor.close()
                return True
            except Exception:
                self.conn = None
                self.mode = "none"
                return self._connect_sqlserver() or self._connect_mysql()

        if self.mode == "mysql" and self.conn:
            try:
                self.conn.ping(reconnect=True)
                return True
            except Exception:
                self.conn = None
                self.mode = "none"
                return self._connect_sqlserver() or self._connect_mysql()

        return self._connect_sqlserver() or self._connect_mysql()

    def _ensure_tables(self):
        if not self.conn:
            return

        sessions_sql = """
        IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='sessions' AND xtype='U')
        CREATE TABLE sessions (
            id BIGINT IDENTITY(1,1) PRIMARY KEY,
            session_type NVARCHAR(64) NOT NULL,
            payload_json NVARCHAR(MAX) NOT NULL,
            created_at DATETIME2 DEFAULT SYSUTCDATETIME()
        )
        """

        events_sql = """
        IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='events' AND xtype='U')
        CREATE TABLE events (
            id BIGINT IDENTITY(1,1) PRIMARY KEY,
            route_name NVARCHAR(128) NOT NULL,
            payload_json NVARCHAR(MAX) NOT NULL,
            created_at DATETIME2 DEFAULT SYSUTCDATETIME()
        )
        """

        leaderboard_sql = """
        IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='community_leaderboard' AND xtype='U')
        CREATE TABLE community_leaderboard (
            id BIGINT IDENTITY(1,1) PRIMARY KEY,
            name NVARCHAR(128) NOT NULL,
            xp INT NOT NULL DEFAULT 0,
            streak INT NOT NULL DEFAULT 0,
            created_at DATETIME2 DEFAULT SYSUTCDATETIME()
        )
        """

        groups_sql = """
        IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='community_groups' AND xtype='U')
        CREATE TABLE community_groups (
            id BIGINT IDENTITY(1,1) PRIMARY KEY,
            name NVARCHAR(180) NOT NULL,
            topic NVARCHAR(500) NOT NULL,
            members_count INT NOT NULL DEFAULT 0,
            created_at DATETIME2 DEFAULT SYSUTCDATETIME()
        )
        """

        users_sql = """
        IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='users' AND xtype='U')
        CREATE TABLE users (
            id BIGINT IDENTITY(1,1) PRIMARY KEY,
            name NVARCHAR(128) NOT NULL,
            email NVARCHAR(200) NOT NULL UNIQUE,
            password_hash NVARCHAR(255) NOT NULL,
            created_at DATETIME2 DEFAULT SYSUTCDATETIME()
        )
        """

        students_sql = """
        IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='students' AND xtype='U')
        CREATE TABLE students (
            id BIGINT IDENTITY(1,1) PRIMARY KEY,
            name NVARCHAR(140) NOT NULL,
            roll_number NVARCHAR(64) NOT NULL UNIQUE,
            xp INT NOT NULL DEFAULT 0,
            created_at DATETIME2 DEFAULT SYSUTCDATETIME()
        )
        """

        cursor = self.conn.cursor()
        cursor.execute(sessions_sql)
        cursor.execute(events_sql)
        cursor.execute(leaderboard_sql)
        cursor.execute(groups_sql)
        cursor.execute(users_sql)
        cursor.execute(students_sql)
        cursor.close()

    def _utc_now(self) -> str:
        return datetime.now(timezone.utc).isoformat()

    def _ensure_tables_mysql(self):
        if not self.conn:
            return
        cursor = self.conn.cursor()
        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS sessions (
              id BIGINT AUTO_INCREMENT PRIMARY KEY,
              session_type VARCHAR(64) NOT NULL,
              payload_json LONGTEXT NOT NULL,
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
            """
        )
        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS events (
              id BIGINT AUTO_INCREMENT PRIMARY KEY,
              route_name VARCHAR(128) NOT NULL,
              payload_json LONGTEXT NOT NULL,
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
            """
        )
        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS community_leaderboard (
              id BIGINT AUTO_INCREMENT PRIMARY KEY,
              name VARCHAR(128) NOT NULL,
              xp INT NOT NULL DEFAULT 0,
              streak INT NOT NULL DEFAULT 0,
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
            """
        )
        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS community_groups (
              id BIGINT AUTO_INCREMENT PRIMARY KEY,
              name VARCHAR(180) NOT NULL,
              topic VARCHAR(500) NOT NULL,
              members_count INT NOT NULL DEFAULT 0,
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
            """
        )
        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS users (
              id BIGINT AUTO_INCREMENT PRIMARY KEY,
              name VARCHAR(128) NOT NULL,
              email VARCHAR(200) NOT NULL UNIQUE,
              password_hash VARCHAR(255) NOT NULL,
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
            """
        )
        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS students (
              id BIGINT AUTO_INCREMENT PRIMARY KEY,
              name VARCHAR(140) NOT NULL,
              roll_number VARCHAR(64) NOT NULL UNIQUE,
              xp INT NOT NULL DEFAULT 0,
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
            """
        )
        cursor.close()

    def save_session(self, payload: dict[str, Any]) -> str | None:
        with self._db_lock:
            if not self._ensure_connection():
                return None

            payload["createdAt"] = self._utc_now()
            session_type = str(payload.get("type", "unknown"))
            payload_json = json.dumps(payload, ensure_ascii=False)

            cursor = self.conn.cursor()
            if self.mode == "sqlserver":
                cursor.execute("INSERT INTO sessions (session_type, payload_json) VALUES (?, ?)", (session_type, payload_json))
                cursor.execute("SELECT SCOPE_IDENTITY()")
                row = cursor.fetchone()
                new_id = str(int(row[0])) if row and row[0] is not None else None
            else:
                cursor.execute("INSERT INTO sessions (session_type, payload_json) VALUES (%s, %s)", (session_type, payload_json))
                new_id = str(cursor.lastrowid) if cursor.lastrowid else None
            cursor.close()
            return new_id

    def save_event(self, route_name: str, payload: dict[str, Any]) -> str | None:
        with self._db_lock:
            if not self._ensure_connection():
                return None

            event_payload = {"createdAt": self._utc_now(), **payload}
            payload_json = json.dumps(event_payload, ensure_ascii=False)

            cursor = self.conn.cursor()
            if self.mode == "sqlserver":
                cursor.execute("INSERT INTO events (route_name, payload_json) VALUES (?, ?)", (route_name, payload_json))
                cursor.execute("SELECT SCOPE_IDENTITY()")
                row = cursor.fetchone()
                new_id = str(int(row[0])) if row and row[0] is not None else None
            else:
                cursor.execute("INSERT INTO events (route_name, payload_json) VALUES (%s, %s)", (route_name, payload_json))
                new_id = str(cursor.lastrowid) if cursor.lastrowid else None
            cursor.close()
            return new_id

    def list_leaderboard(self, limit: int = 20) -> list[dict[str, Any]]:
        with self._db_lock:
            if not self._ensure_connection():
                return []
            cursor = self.conn.cursor()
            if self.mode == "sqlserver":
                cursor.execute(
                    "SELECT TOP (?) id, name, xp, streak FROM community_leaderboard ORDER BY xp DESC, streak DESC, id ASC",
                    (int(limit),),
                )
            else:
                cursor.execute(
                    "SELECT id, name, xp, streak FROM community_leaderboard ORDER BY xp DESC, streak DESC, id ASC LIMIT %s",
                    (int(limit),),
                )
            rows = cursor.fetchall()
            cursor.close()
            return [{"id": int(r[0]), "name": r[1], "xp": int(r[2]), "streak": int(r[3])} for r in rows]

    def add_leaderboard_entry(self, name: str, xp: int, streak: int) -> str | None:
        with self._db_lock:
            if not self._ensure_connection():
                return None
            cursor = self.conn.cursor()
            if self.mode == "sqlserver":
                cursor.execute(
                    "INSERT INTO community_leaderboard (name, xp, streak) VALUES (?, ?, ?)",
                    (name, int(xp), int(streak)),
                )
                cursor.execute("SELECT SCOPE_IDENTITY()")
                row = cursor.fetchone()
                new_id = str(int(row[0])) if row and row[0] is not None else None
            else:
                cursor.execute(
                    "INSERT INTO community_leaderboard (name, xp, streak) VALUES (%s, %s, %s)",
                    (name, int(xp), int(streak)),
                )
                new_id = str(cursor.lastrowid) if cursor.lastrowid else None
            cursor.close()
            return new_id

    def list_groups(self, limit: int = 50) -> list[dict[str, Any]]:
        if not self._ensure_connection():
            return []
        cursor = self.conn.cursor()
        if self.mode == "sqlserver":
            cursor.execute(
                "SELECT TOP (?) id, name, topic, members_count FROM community_groups ORDER BY id DESC",
                (int(limit),),
            )
        else:
            cursor.execute(
                "SELECT id, name, topic, members_count FROM community_groups ORDER BY id DESC LIMIT %s",
                (int(limit),),
            )
        rows = cursor.fetchall()
        cursor.close()
        return [
            {"id": int(r[0]), "name": r[1], "topic": r[2], "members": int(r[3])}
            for r in rows
        ]

    def create_group(self, name: str, topic: str) -> str | None:
        if not self._ensure_connection():
            return None
        cursor = self.conn.cursor()
        if self.mode == "sqlserver":
            cursor.execute(
                "INSERT INTO community_groups (name, topic, members_count) VALUES (?, ?, 1)",
                (name, topic),
            )
            cursor.execute("SELECT SCOPE_IDENTITY()")
            row = cursor.fetchone()
            new_id = str(int(row[0])) if row and row[0] is not None else None
        else:
            cursor.execute(
                "INSERT INTO community_groups (name, topic, members_count) VALUES (%s, %s, 1)",
                (name, topic),
            )
            new_id = str(cursor.lastrowid) if cursor.lastrowid else None
        cursor.close()
        return new_id

    def join_group(self, group_id: int) -> bool:
        if not self._ensure_connection():
            return False
        cursor = self.conn.cursor()
        if self.mode == "sqlserver":
            cursor.execute(
                "UPDATE community_groups SET members_count = members_count + 1 WHERE id = ?",
                (int(group_id),),
            )
        else:
            cursor.execute(
                "UPDATE community_groups SET members_count = members_count + 1 WHERE id = %s",
                (int(group_id),),
            )
        updated = cursor.rowcount > 0
        cursor.close()
        return updated

    def create_user(self, name: str, email: str, password_hash: str) -> str | None:
        if not self._ensure_connection():
            return None
        cursor = self.conn.cursor()
        if self.mode == "sqlserver":
            cursor.execute(
                "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
                (name, email.lower(), password_hash),
            )
            cursor.execute("SELECT SCOPE_IDENTITY()")
            row = cursor.fetchone()
            new_id = str(int(row[0])) if row and row[0] is not None else None
        else:
            cursor.execute(
                "INSERT INTO users (name, email, password_hash) VALUES (%s, %s, %s)",
                (name, email.lower(), password_hash),
            )
            new_id = str(cursor.lastrowid) if cursor.lastrowid else None
        cursor.close()
        return new_id

    def get_user_by_email(self, email: str) -> dict[str, Any] | None:
        if not self._ensure_connection():
            return None
        cursor = self.conn.cursor()
        if self.mode == "sqlserver":
            cursor.execute(
                "SELECT TOP 1 id, name, email, password_hash, created_at FROM users WHERE email = ?",
                (email.lower(),),
            )
        else:
            cursor.execute(
                "SELECT id, name, email, password_hash, created_at FROM users WHERE email = %s LIMIT 1",
                (email.lower(),),
            )
        row = cursor.fetchone()
        cursor.close()
        if not row:
            return None
        return {
            "id": int(row[0]),
            "name": row[1],
            "email": row[2],
            "password_hash": row[3],
            "created_at": str(row[4]) if row[4] else None,
        }

    def list_users(self, limit: int = 200) -> list[dict[str, Any]]:
        if not self._ensure_connection():
            return []
        cursor = self.conn.cursor()
        if self.mode == "sqlserver":
            cursor.execute(
                "SELECT TOP (?) id, name, email, created_at FROM users ORDER BY id DESC",
                (int(limit),),
            )
        else:
            cursor.execute(
                "SELECT id, name, email, created_at FROM users ORDER BY id DESC LIMIT %s",
                (int(limit),),
            )
        rows = cursor.fetchall()
        cursor.close()
        return [
            {
                "id": int(r[0]),
                "name": r[1],
                "email": r[2],
                "created_at": str(r[3]) if r[3] else None,
            }
            for r in rows
        ]

    def list_students(self, query: str = "", limit: int = 200) -> list[dict[str, Any]]:
        if not self._ensure_connection():
            return []

        search = f"%{query.strip()}%"
        cursor = self.conn.cursor()
        if self.mode == "sqlserver":
            if query.strip():
                cursor.execute(
                    """
                    SELECT TOP (?) id, name, roll_number, xp, created_at
                    FROM students
                    WHERE name LIKE ? OR roll_number LIKE ?
                    ORDER BY xp DESC, id ASC
                    """,
                    (int(limit), search, search),
                )
            else:
                cursor.execute(
                    "SELECT TOP (?) id, name, roll_number, xp, created_at FROM students ORDER BY xp DESC, id ASC",
                    (int(limit),),
                )
        else:
            if query.strip():
                cursor.execute(
                    """
                    SELECT id, name, roll_number, xp, created_at
                    FROM students
                    WHERE name LIKE %s OR roll_number LIKE %s
                    ORDER BY xp DESC, id ASC
                    LIMIT %s
                    """,
                    (search, search, int(limit)),
                )
            else:
                cursor.execute(
                    "SELECT id, name, roll_number, xp, created_at FROM students ORDER BY xp DESC, id ASC LIMIT %s",
                    (int(limit),),
                )
        rows = cursor.fetchall()
        cursor.close()
        return [
            {
                "id": int(r[0]),
                "name": r[1],
                "rollNumber": r[2],
                "xp": int(r[3]),
                "createdAt": str(r[4]) if r[4] else None,
            }
            for r in rows
        ]

    def create_student(self, name: str, roll_number: str, xp: int = 0) -> str | None:
        if not self._ensure_connection():
            return None
        cursor = self.conn.cursor()
        if self.mode == "sqlserver":
            cursor.execute(
                "INSERT INTO students (name, roll_number, xp) VALUES (?, ?, ?)",
                (name, roll_number.upper(), int(xp)),
            )
            cursor.execute("SELECT SCOPE_IDENTITY()")
            row = cursor.fetchone()
            new_id = str(int(row[0])) if row and row[0] is not None else None
        else:
            cursor.execute(
                "INSERT INTO students (name, roll_number, xp) VALUES (%s, %s, %s)",
                (name, roll_number.upper(), int(xp)),
            )
            new_id = str(cursor.lastrowid) if cursor.lastrowid else None
        cursor.close()
        return new_id

    def delete_student(self, student_id: int) -> bool:
        if not self._ensure_connection():
            return False
        cursor = self.conn.cursor()
        if self.mode == "sqlserver":
            cursor.execute("DELETE FROM students WHERE id = ?", (int(student_id),))
        else:
            cursor.execute("DELETE FROM students WHERE id = %s", (int(student_id),))
        deleted = cursor.rowcount > 0
        cursor.close()
        return deleted
