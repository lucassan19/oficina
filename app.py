from flask import Flask, render_template, request, send_file, jsonify
from flask_cors import CORS
from utils.gerar_pdf import gerar_pdf_orcamento
from utils.gerar_word import gerar_word_orcamento
import os

app = Flask(__name__)
CORS(app)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/gerar_pdf', methods=['POST'])
def gerar_pdf():
    dados = request.json
    pdf_buffer = gerar_pdf_orcamento(dados)
    return send_file(
        pdf_buffer,
        as_attachment=True,
        download_name=f"orcamento_{dados['cliente']['nome']}.pdf",
        mimetype='application/pdf'
    )

@app.route('/gerar_word', methods=['POST'])
def gerar_word():
    dados = request.json
    word_buffer = gerar_word_orcamento(dados)
    return send_file(
        word_buffer,
        as_attachment=True,
        download_name=f"orcamento_{dados['cliente']['nome']}.docx",
        mimetype='application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    )

if __name__ == '__main__':
    app.run(debug=True, port=5000)
