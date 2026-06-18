import pyxel

class App:
    def __init__(self):
        pyxel.init(200, 200, title="Father's Day Mini Game")

        # 怪獣（プレイヤー）
        self.kaiju_x = 100
        self.kaiju_y = 180
        self.kaiju_hp = 20

        # 真珠
        self.pearls = []
        self.pearl_count = 0

        # 光線
        self.beams = []

        # ゲーム状態
        self.state = "PLAY"  # PLAY / GAMEOVER / CLEAR

        pyxel.run(self.update, self.draw)

    # -------------------------
    # 更新処理
    # -------------------------
    def update(self):
        if self.state != "PLAY":
            return

        # 怪獣の移動
        if pyxel.btn(pyxel.KEY_LEFT) or pyxel.btn(pyxel.KEY_A):
            self.kaiju_x -= 4
        if pyxel.btn(pyxel.KEY_RIGHT) or pyxel.btn(pyxel.KEY_D):
            self.kaiju_x += 4

        # 画面外に出ないように
        if self.kaiju_x < 4:
            self.kaiju_x = 4
        if self.kaiju_x > 196:
            self.kaiju_x = 196

        # 真珠生成（1.5秒に1回）
        if pyxel.frame_count % 45 == 0:
            self.spawn_pearl()

        # 光線生成（1秒に1回）
        if pyxel.frame_count % 60 == 0:
            self.spawn_beam()

        self.update_pearls()
        self.update_beams()

        # HPが0でゲームオーバー
        if self.kaiju_hp <= 0:
            self.state = "GAMEOVER"

        # 真珠10個でクリア
        if self.pearl_count >= 10:
            self.state = "CLEAR"

    # -------------------------
    # 描画処理
    # -------------------------
    def draw(self):
        pyxel.cls(0)

        # 怪獣（プレイヤー）
        pyxel.rect(self.kaiju_x - 4, self.kaiju_y - 4, 8, 8, 8)

        # 真珠
        for p in self.pearls:
            pyxel.circ(p["x"], p["y"], 2, 7)

        # 光線
        for b in self.beams:
            pyxel.line(b["x"], b["y"], b["x"] - 5, b["y"] - 10, 7)

        # UI
        pyxel.text(5, 5, f"Pearl: {self.pearl_count} / 10", 7)
        pyxel.text(5, 15, f"Kaiju HP: {self.kaiju_hp}", 7)

        # GAME OVER
        if self.state == "GAMEOVER":
            pyxel.rect(40, 90, 120, 25, 0)
            pyxel.text(80, 100, "GAME OVER", 8)

        # GAME CLEAR
        if self.state == "CLEAR":
            pyxel.rect(40, 90, 120, 25, 0)
            pyxel.text(76, 100, "GAME CLEAR!", 10)

    # -------------------------
    # 真珠
    # -------------------------
    def spawn_pearl(self):
        self.pearls.append({"x": pyxel.rndi(10, 190), "y": 0})

    def update_pearls(self):
        for p in self.pearls[:]:
            p["y"] += 1

            dx = p["x"] - self.kaiju_x
            dy = p["y"] - self.kaiju_y

            # 取得判定
            if dx * dx + dy * dy <= 16:
                self.pearls.remove(p)
                self.pearl_count += 1
                continue

            # 画面外
            if p["y"] > 200:
                self.pearls.remove(p)

    # -------------------------
    # 光線
    # -------------------------
    def spawn_beam(self):
        self.beams.append({
            "x": pyxel.rndi(20, 180),
            "y": 0,
            "vx": 1,
            "vy": 2
        })

    def update_beams(self):
        for b in self.beams[:]:
            b["x"] += b["vx"]
            b["y"] += b["vy"]

            # 当たり判定
            if abs(b["x"] - self.kaiju_x) < 5 and abs(b["y"] - self.kaiju_y) < 5:
                self.kaiju_hp -= 1
                self.beams.remove(b)
                continue

            # 画面外
            if b["y"] > 200 or b["x"] > 200:
                self.beams.remove(b)


App()
