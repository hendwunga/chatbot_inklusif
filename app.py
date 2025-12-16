import os
from flask import Flask, render_template, request, jsonify, send_file
import openai
from dotenv import load_dotenv
from gtts import gTTS
from io import BytesIO

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

app = Flask(__name__)

# Simpan kata penting relevan untuk latihan interaktif
interactive_terms = []

@app.route("/")
def index():
    return render_template("index.html")

def generate_prompt(user_message):
    """
    Prompt untuk jawaban lengkap dengan kata penting dan highlight
    """
    return (
        f"Sederhanakan teks ini agar mudah dipahami, gunakan kata sederhana, "
        f"pecah kalimat panjang menjadi langkah/point jika perlu.\n\n"
        f"Teks:\n{user_message}\n\n"
        "Tandai kata penting dengan format [[tipe:kata|definisi|contoh]] "
        "di mana tipe bisa: konsep, tindakan, kata_kunci. Jawaban harus mudah dibaca dan jelas."
    )

@app.route("/chat_highlight_icon", methods=["POST"])
def chat_highlight_icon():
    user_message = request.json.get("message")
    if not user_message:
        return jsonify({"error": "No message provided"}), 400

    try:
        # Jawaban lengkap
        prompt = generate_prompt(user_message)
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=500
        )
        full_answer = response.choices[0].message['content']

        # Jawaban ringkas
        summary_prompt = f"Buat ringkasan singkat dari teks berikut, tetap menandai kata penting:\n{full_answer}"
        summary_response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": summary_prompt}],
            max_tokens=150
        )
        summary_answer = summary_response.choices[0].message['content']

        # --- Ambil kata penting yang relevan dengan pertanyaan user --- #
        relevance_prompt = (
            f"Dari jawaban lengkap berikut, pilih 3 kata penting yang paling relevan dengan pertanyaan ini "
            f"untuk latihan interaktif. Format tetap [[tipe:kata|definisi|contoh]]\n"
            f"Pertanyaan user: {user_message}\nJawaban lengkap: {full_answer}"
        )
        relevance_response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[{"role":"user","content":relevance_prompt}],
            max_tokens=150
        )
        terms_text = relevance_response.choices[0].message['content']

        # Ambil kata dari format [[tipe:kata|definisi|contoh]]
        import re
        terms = re.findall(r"\[\[(?:.*?):(.*?)(?:\|.*?){0,2}\]\]", terms_text)
        global interactive_terms
        interactive_terms = list(set(terms))

        return jsonify({"full": full_answer, "summary": summary_answer})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Endpoint TTS
@app.route("/tts", methods=["POST"])
def tts():
    text = request.json.get("text")
    if not text:
        return jsonify({"error": "No text provided"}), 400

    tts = gTTS(text, lang='id')
    mp3_fp = BytesIO()
    tts.write_to_fp(mp3_fp)
    mp3_fp.seek(0)
    return send_file(mp3_fp, mimetype="audio/mpeg")

# Endpoint latihan interaktif: bot menanyakan kata penting relevan
@app.route("/interactive_question", methods=["GET"])
def interactive_question():
    import random
    if not interactive_terms:
        return jsonify({"question": None})
    term = random.choice(interactive_terms)
    question = f"Apa fungsi atau makna dari '{term}' dalam konteks pertanyaan Anda?"
    return jsonify({"question": question, "term": term})

# Endpoint jawaban latihan: evaluasi jawaban user
@app.route("/interactive_answer", methods=["POST"])
def interactive_answer():
    data = request.json
    term = data.get("term")
    user_answer = data.get("answer")
    if not term or not user_answer:
        return jsonify({"error": "Term atau answer tidak diberikan"}), 400

    eval_prompt = (
        f"User menjawab pertanyaan: Apa fungsi '{term}'?\n"
        f"Jawaban user: {user_answer}\n"
        "Tolong beri feedback singkat: 'Benar' atau 'Salah', dan jelaskan dengan bahasa sederhana, maksimal 40 kata."
    )

    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": eval_prompt}],
            max_tokens=60
        )
        feedback = response.choices[0].message['content']
        return jsonify({"feedback": feedback})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
