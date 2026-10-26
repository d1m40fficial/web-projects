import json
import random
import time
from dataclasses import dataclass, asdict
from datetime import datetime
from pathlib import Path
import customtkinter as ctk
from tkinter import messagebox

APP_TITLE = 'Nohea'
HISTORY_MD = Path(__file__).with_name('training_history.md')
HISTORY_JSON = Path(__file__).with_name('training_history.json')

LIGHT = {
    'app_bg': '#f4f7fb',
    'card': '#ffffff',
    'card_alt': '#f9fbff',
    'border': '#e7edf6',
    'text': '#14213d',
    'muted': '#7a8597',
    'input_bg': '#f9fbff',
    'input_border': '#dfe7f3',
    'accent': '#7da8ff',
    'accent_hover': '#6997fa',
    'accent_text': '#ffffff',
    'soft_btn': '#eef4ff',
    'soft_hover': '#dde8ff',
    'soft_text': '#284180',
    'feedback': '#c2410c',
    'icon_bg': '#eef4ff',
    'icon_hover': '#dde9ff',
    'icon_text': '#2f4ea8',
}

DARK = {
    'app_bg': '#0f1724',
    'card': '#172131',
    'card_alt': '#1d293b',
    'border': '#263244',
    'text': '#edf3ff',
    'muted': '#99a7bd',
    'input_bg': '#111a28',
    'input_border': '#2b3a50',
    'accent': '#7da8ff',
    'accent_hover': '#6997fa',
    'accent_text': '#ffffff',
    'soft_btn': '#223149',
    'soft_hover': '#2a3b57',
    'soft_text': '#dbe8ff',
    'feedback': '#ff9a6b',
    'icon_bg': '#223149',
    'icon_hover': '#2a3b57',
    'icon_text': '#dbe8ff',
}

ctk.set_appearance_mode('dark')
ctk.set_default_color_theme('blue')


@dataclass
class SessionResult:
    started_at: str
    duration_minutes: int
    elapsed_seconds: int
    total_answered: int
    correct: int
    incorrect: int
    accuracy_percent: float
    best_streak: int
    current_streak_end: int
    problems_per_minute: float
    average_response_seconds: float
    mode_name: str


class MathGenerator:
    def __init__(self):
        self.level = 1

    def next_problem(self):
        self.level += 1
        stage = min(6, 1 + self.level // 10)
        if stage == 1:
            a, b = random.randint(1, 9), random.randint(1, 9)
            op = random.choice(['+', '-'])
        elif stage == 2:
            a, b = random.randint(5, 30), random.randint(1, 20)
            op = random.choice(['+', '-'])
        elif stage == 3:
            a, b = random.randint(2, 12), random.randint(2, 12)
            op = random.choice(['+', '-', '×'])
        elif stage == 4:
            a, b = random.randint(10, 60), random.randint(2, 15)
            op = random.choice(['+', '-', '×'])
        elif stage == 5:
            op = random.choice(['+', '-', '×', '÷'])
            if op == '÷':
                b = random.randint(2, 12)
                ans = random.randint(2, 12)
                a = b * ans
            else:
                a, b = random.randint(10, 99), random.randint(2, 20)
        else:
            op = random.choice(['+', '-', '×', '÷'])
            if op == '÷':
                b = random.randint(2, 15)
                ans = random.randint(3, 20)
                a = b * ans
            else:
                a, b = random.randint(20, 150), random.randint(3, 30)

        if op == '+':
            answer = a + b
        elif op == '-':
            if a < b:
                a, b = b, a
            answer = a - b
        elif op == '×':
            answer = a * b
        else:
            answer = a // b
        return f'{a} {op} {b} =', str(answer)


class HistoryStore:
    def __init__(self, json_path: Path, md_path: Path):
        self.json_path = json_path
        self.md_path = md_path

    def load(self):
        if self.json_path.exists():
            try:
                return json.loads(self.json_path.read_text(encoding='utf-8'))
            except Exception:
                return []
        return []

    def save_result(self, result: SessionResult):
        data = self.load()
        data.append(asdict(result))
        self.json_path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding='utf-8')
        self._write_md(data)

    def _write_md(self, data):
        lines = [
            f'# {APP_TITLE} — история тренировок',
            '',
            '| Дата | Режим | Длительность | Решено | Верно | Ошибки | Точность | Лучший стрик | Скорость | Среднее время |',
            '|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|',
        ]
        for item in reversed(data):
            dt = item['started_at'].replace('T', ' ')[:16]
            lines.append(
                f"| {dt} | {item['mode_name']} | {item['duration_minutes']} мин | {item['total_answered']} | {item['correct']} | {item['incorrect']} | {item['accuracy_percent']:.1f}% | {item['best_streak']} | {item['problems_per_minute']:.1f}/мин | {item['average_response_seconds']:.2f} c |"
            )
        self.md_path.write_text('\n'.join(lines) + '\n', encoding='utf-8')


class NoheaApp(ctk.CTk):
    def __init__(self):
        super().__init__()
        self.title(APP_TITLE)
        self.geometry('520x280')
        self.minsize(400, 150)

        self.theme_mode = 'dark'
        self.colors = DARK.copy()

        self.generator = MathGenerator()
        self.history = HistoryStore(HISTORY_JSON, HISTORY_MD)

        self.duration = 5
        self.started_ts = None
        self.deadline_ts = None
        self.problem_started_ts = None
        self.after_id = None
        self.session_active = False
        self.is_paused = False
        self.pause_remaining = None
        self.expected_answer = ''
        self.response_times = []
        self.correct = 0
        self.incorrect = 0
        self.current_streak = 0
        self.best_streak = 0
        self.total_answered = 0
        self.block_wrong_until_clear = False

        self.build_ui()
        self.bind_events()
        self.set_duration(5)
        self.new_problem(initial=True)
        self.refresh_stats()
        self.apply_theme()

    def build_ui(self):
        self.configure(fg_color=self.colors['app_bg'])
        self.grid_columnconfigure(0, weight=1)
        self.grid_rowconfigure(0, weight=0)
        self.grid_rowconfigure(1, weight=0)

        top = ctk.CTkFrame(self, fg_color='transparent')
        top.grid(row=0, column=0, sticky='ew', padx=10, pady=(10, 8))
        top.grid_columnconfigure(0, weight=0)
        top.grid_columnconfigure(1, weight=0)

        self.practice_card = ctk.CTkFrame(top, corner_radius=24, border_width=1, width=260, height=140)
        self.practice_card.grid(row=0, column=0, sticky='w', padx=(0, 10))
        self.practice_card.grid_propagate(False)

        self.timer_card = ctk.CTkFrame(top, corner_radius=24, border_width=1, width=230, height=140)
        self.timer_card.grid(row=0, column=1, sticky='w')
        self.timer_card.grid_propagate(False)

        self.stats_card = ctk.CTkFrame(self, corner_radius=24, border_width=1, width=500, height=110)
        self.stats_card.grid(row=1, column=0, sticky='w', padx=10, pady=(0, 10))
        self.stats_card.grid_propagate(False)

        self.practice_card.grid_columnconfigure(0, weight=1)

        header = ctk.CTkFrame(self.practice_card, fg_color='transparent')
        header.grid(row=0, column=0, sticky='ew', padx=18, pady=(14, 2))
        header.grid_columnconfigure(0, weight=1)

        self.title_label = ctk.CTkLabel(
            header,
            text='Nohea',
            font=ctk.CTkFont(size=24, weight='bold')
        )
        self.title_label.grid(row=0, column=0, sticky='w')

        icons = ctk.CTkFrame(header, fg_color='transparent')
        icons.grid(row=0, column=1, sticky='e', padx=(2, 0))

        self.help_btn = ctk.CTkButton(
            icons,
            text='?',
            width=28,
            height=28,
            corner_radius=14,
            font=ctk.CTkFont(size=14, weight='bold'),
            command=self.show_help
        )
        self.help_btn.pack(side='left', padx=(0, 6))

        self.theme_btn = ctk.CTkButton(
            icons,
            text='☀',
            width=28,
            height=28,
            corner_radius=14,
            font=ctk.CTkFont(size=13, weight='bold'),
            command=self.toggle_theme
        )
        self.theme_btn.pack(side='left')

        solve_row = ctk.CTkFrame(self.practice_card, fg_color='transparent')
        solve_row.grid(row=1, column=0, sticky='w', padx=18, pady=(8, 0))

        self.problem_label = ctk.CTkLabel(
            solve_row,
            text='9 - 4 =',
            font=ctk.CTkFont(size=34, weight='bold')
        )
        self.problem_label.pack(side='left', padx=(0, 10))

        self.answer_entry = ctk.CTkEntry(
            solve_row,
            width=120,
            height=44,
            corner_radius=18,
            border_width=1,
            font=ctk.CTkFont(size=22),
            justify='center',
            placeholder_text='?'
        )
        self.answer_entry.pack(side='left')

        self.feedback_label = ctk.CTkLabel(
            self.practice_card,
            text='',
            font=ctk.CTkFont(size=11, weight='bold')
        )
        self.feedback_label.grid(row=2, column=0, sticky='w', padx=22, pady=(6, 0))

        self.timer_card.grid_columnconfigure(0, weight=1)

        title_row = ctk.CTkFrame(self.timer_card, fg_color='transparent')
        title_row.grid(row=0, column=0, sticky='ew', padx=18, pady=(14, 2))
        title_row.grid_columnconfigure(0, weight=1)

        left_time = ctk.CTkFrame(title_row, fg_color='transparent')
        left_time.grid(row=0, column=0, sticky='w')

        self.timer_header = ctk.CTkFrame(left_time, fg_color='transparent')
        self.timer_header.pack(anchor='w')

        self.timer_caption = ctk.CTkLabel(
            self.timer_header,
            text='Timer',
            font=ctk.CTkFont(size=13, weight='bold')
        )
        self.timer_caption.pack(side='left')

        self.status_label = ctk.CTkLabel(
            self.timer_header,
            text='Ready.',
            font=ctk.CTkFont(size=11)
        )
        self.status_label.pack(side='left', padx=(10, 0))

        self.timer_label = ctk.CTkLabel(
            left_time,
            text='05:00',
            font=ctk.CTkFont(size=30, weight='bold')
        )
        self.timer_label.pack(anchor='w', pady=(2, 0))

        self.pause_btn = ctk.CTkButton(
            title_row,
            text='Start',
            width=48,
            height=38,
            corner_radius=19,
            font=ctk.CTkFont(size=14, weight='bold'),
            command=self.toggle_start_pause
        )
        self.pause_btn.grid(row=0, column=1, sticky='e', padx=(4, 0), pady=(8, 0))

        presets = ctk.CTkFrame(self.timer_card, fg_color='transparent')
        presets.grid(row=1, column=0, sticky='w', padx=18, pady=(10, 0))

        self.duration_buttons = {}
        for col, mins in enumerate((5, 10, 15)):
            btn = ctk.CTkButton(
                presets,
                text=str(mins),
                width=59,
                height=40,
                corner_radius=16,
                border_width=1,
                font=ctk.CTkFont(size=15, weight='bold'),
                command=lambda m=mins: self.set_duration(m)
            )
            btn.grid(row=0, column=col, padx=(0 if col == 0 else 8, 0), sticky='w')
            self.duration_buttons[mins] = btn

        self.stats_card.grid_columnconfigure((0, 1, 2, 3, 4), weight=0)
        self.stats = {}
        self.stat_titles = {}
        self.stat_default_sizes = {}
        items = [
            ('correct', 'Correct'),
            ('incorrect', 'Wrong'),
            ('streak', 'Streak'),
            ('best', 'Best streak'),
            ('speed', 'Per minute'),
        ]

        for col, (key, title) in enumerate(items):
            card = ctk.CTkFrame(
                self.stats_card,
                corner_radius=18,
                border_width=1,
                width=88,
                height=74
            )
            card.grid(row=0, column=col, sticky='w', padx=(10 if col == 0 else 8, 0), pady=10)
            card.grid_propagate(False)

            number = ctk.CTkLabel(card, text='0', font=ctk.CTkFont(size=24, weight='bold'))
            number.pack(anchor='w', padx=14, pady=(10, 0))

            title_lbl = ctk.CTkLabel(card, text=title, font=ctk.CTkFont(size=11))
            title_lbl.pack(anchor='w', padx=14, pady=(2, 0))

            self.stats[key] = (card, number)
            self.stat_titles[key] = title_lbl
            self.stat_default_sizes[key] = (88, 74)

            card.bind('<Enter>', lambda e, k=key: self.animate_stat_card(k, hover=True))
            card.bind('<Leave>', lambda e, k=key: self.animate_stat_card(k, hover=False))
            number.bind('<Enter>', lambda e, k=key: self.animate_stat_card(k, hover=True))
            number.bind('<Leave>', lambda e, k=key: self.animate_stat_card(k, hover=False))
            title_lbl.bind('<Enter>', lambda e, k=key: self.animate_stat_card(k, hover=True))
            title_lbl.bind('<Leave>', lambda e, k=key: self.animate_stat_card(k, hover=False))

    def animate_stat_card(self, key, hover):
        card, _number = self.stats[key]
        base_w, base_h = self.stat_default_sizes[key]
        if hover:
            card.configure(width=98, height=80)
        else:
            card.configure(width=base_w, height=base_h)

    def bind_events(self):
        self.answer_entry.bind('<KeyRelease>', self.on_input)
        self.protocol('WM_DELETE_WINDOW', self.on_close)

    def apply_theme(self):
        c = self.colors
        self.configure(fg_color=c['app_bg'])

        for frame in [self.practice_card, self.timer_card, self.stats_card]:
            frame.configure(fg_color=c['card'], border_color=c['border'])

        self.title_label.configure(text_color=c['text'])
        self.problem_label.configure(text_color=c['text'])
        self.timer_caption.configure(text_color=c['muted'])
        self.timer_label.configure(text_color=c['text'])
        self.feedback_label.configure(text_color=c['feedback'])
        self.status_label.configure(text_color=c['muted'])

        self.help_btn.configure(
            fg_color=c['icon_bg'],
            hover_color=c['icon_hover'],
            text_color=c['icon_text']
        )
        self.theme_btn.configure(
            fg_color=c['icon_bg'],
            hover_color=c['icon_hover'],
            text_color=c['icon_text']
        )
        self.answer_entry.configure(
            fg_color=c['input_bg'],
            border_color=c['input_border'],
            text_color=c['text']
        )
        self.pause_btn.configure(
            fg_color=c['accent'],
            hover_color=c['accent_hover'],
            text_color=c['accent_text']
        )

        for mins, btn in self.duration_buttons.items():
            if mins == self.duration:
                btn.configure(
                    fg_color=c['accent'],
                    hover_color=c['accent_hover'],
                    text_color=c['accent_text'],
                    border_color=c['accent']
                )
            else:
                btn.configure(
                    fg_color=c['soft_btn'],
                    hover_color=c['soft_hover'],
                    text_color=c['soft_text'],
                    border_color=c['border']
                )

        for key, (card, number) in self.stats.items():
            card.configure(fg_color=c['card_alt'], border_color=c['border'])
            number.configure(text_color=c['text'])
            self.stat_titles[key].configure(text_color=c['muted'])

    def show_help(self):
        messagebox.showinfo(
            'Nohea',
            'Type the answer and the next example appears automatically.\nUse Start/Pause in the timer block.\nChoose 5, 10 or 15 minutes.'
        )

    def toggle_theme(self):
        if self.theme_mode == 'dark':
            self.theme_mode = 'light'
            self.colors = LIGHT.copy()
            self.theme_btn.configure(text='☾')
        else:
            self.theme_mode = 'dark'
            self.colors = DARK.copy()
            self.theme_btn.configure(text='☀')
        self.apply_theme()

    def set_duration(self, minutes):
        self.duration = max(1, int(minutes))
        if not self.session_active:
            self.timer_label.configure(text=f'{self.duration:02d}:00')
        self.apply_theme()

    def toggle_start_pause(self):
        if not self.session_active:
            self.start_session()
        elif self.is_paused:
            self.resume_session()
        else:
            self.pause_session()

    def start_session(self):
        self.correct = 0
        self.incorrect = 0
        self.current_streak = 0
        self.best_streak = 0
        self.total_answered = 0
        self.response_times = []
        self.generator = MathGenerator()
        self.started_ts = time.time()
        self.deadline_ts = self.started_ts + self.duration * 60
        self.session_active = True
        self.is_paused = False
        self.pause_remaining = None
        self.pause_btn.configure(text='Pause')
        self.status_label.configure(text='Running.')
        self.new_problem()
        self.refresh_stats()
        self.tick()

    def pause_session(self):
        if not self.session_active or self.is_paused:
            return
        if self.after_id:
            self.after_cancel(self.after_id)
            self.after_id = None
        self.pause_remaining = max(0, self.deadline_ts - time.time())
        self.is_paused = True
        self.pause_btn.configure(text='Resume')
        self.status_label.configure(text='Paused.')

    def resume_session(self):
        if not self.session_active or not self.is_paused:
            return
        self.deadline_ts = time.time() + self.pause_remaining
        self.is_paused = False
        self.pause_btn.configure(text='Pause')
        self.status_label.configure(text='Running.')
        self.answer_entry.focus_set()
        self.tick()

    def new_problem(self, initial=False):
        problem, answer = self.generator.next_problem()
        self.expected_answer = answer
        self.problem_label.configure(text=problem)
        self.problem_started_ts = time.time()
        self.answer_entry.delete(0, 'end')
        self.feedback_label.configure(text='')
        self.block_wrong_until_clear = False
        if self.session_active or initial:
            self.after(30, self.answer_entry.focus_set)

    def tick(self):
        if not self.session_active or self.is_paused:
            return

        remain = max(0, int(round(self.deadline_ts - time.time())))
        mins, secs = divmod(remain, 60)
        self.timer_label.configure(text=f'{mins:02d}:{secs:02d}')

        if remain <= 0:
            self.finish_session(manual=False)
            return

        self.after_id = self.after(200, self.tick)

    def on_input(self, _event=None):
        if not self.session_active or self.is_paused:
            return

        text = self.answer_entry.get().strip()
        if not text:
            self.block_wrong_until_clear = False
            return

        if text == self.expected_answer:
            elapsed = max(0.15, time.time() - self.problem_started_ts)
            self.response_times.append(elapsed)
            self.correct += 1
            self.current_streak += 1
            self.best_streak = max(self.best_streak, self.current_streak)
            self.total_answered += 1
            self.status_label.configure(text='Correct.')
            self.refresh_stats()
            self.after(90, self.new_problem)
            return

        if self.block_wrong_until_clear:
            return

        if len(text) >= len(self.expected_answer):
            self.incorrect += 1
            self.current_streak = 0
            self.total_answered += 1
            self.block_wrong_until_clear = True
            self.feedback_label.configure(text='Wrong answer. Next example...')
            self.status_label.configure(text='Wrong.')
            self.refresh_stats()
            self.after(280, self.new_problem)

    def refresh_stats(self):
        elapsed_minutes = max(1 / 60, ((time.time() - self.started_ts) / 60) if self.started_ts else 1 / 60)
        speed = self.correct / elapsed_minutes
        values = {
            'correct': str(self.correct),
            'incorrect': str(self.incorrect),
            'streak': str(self.current_streak),
            'best': str(self.best_streak),
            'speed': f'{speed:.1f}',
        }

        for key, value in values.items():
            self.stats[key][1].configure(text=value)

    def finish_session(self, manual=False):
        if self.after_id:
            self.after_cancel(self.after_id)
            self.after_id = None

        self.session_active = False
        self.is_paused = False
        self.pause_remaining = None
        self.pause_btn.configure(text='Start')

        elapsed_seconds = int(time.time() - self.started_ts) if self.started_ts else 0
        accuracy = (self.correct / max(1, self.total_answered)) * 100
        avg_resp = sum(self.response_times) / len(self.response_times) if self.response_times else 0.0
        ppm = self.correct / max(elapsed_seconds / 60, 1 / 60)

        result = SessionResult(
            started_at=datetime.now().isoformat(timespec='seconds'),
            duration_minutes=self.duration,
            elapsed_seconds=elapsed_seconds,
            total_answered=self.total_answered,
            correct=self.correct,
            incorrect=self.incorrect,
            accuracy_percent=accuracy,
            best_streak=self.best_streak,
            current_streak_end=self.current_streak,
            problems_per_minute=ppm,
            average_response_seconds=avg_resp,
            mode_name='Simple practice',
        )
        self.history.save_result(result)
        self.status_label.configure(text='Finished.')
        self.show_result(result, manual)

    def show_result(self, result, manual):
        title = 'Session stopped' if manual else 'Time is over'
        text = (
            f'Solved: {result.total_answered}\n'
            f'Correct: {result.correct}\n'
            f'Wrong: {result.incorrect}\n'
            f'Accuracy: {result.accuracy_percent:.1f}%\n'
            f'Best streak: {result.best_streak}\n'
            f'Speed: {result.problems_per_minute:.1f} per min\n'
            f'Average time: {result.average_response_seconds:.2f} sec\n\n'
            f'History updated in training_history.md'
        )
        messagebox.showinfo(title, text)

    def on_close(self):
        if self.session_active and messagebox.askyesno('Exit', 'Session is still active. Stop and close?'):
            self.finish_session(manual=True)
            self.destroy()
        elif not self.session_active:
            self.destroy()


if __name__ == '__main__':
    app = NoheaApp()
    app.mainloop()