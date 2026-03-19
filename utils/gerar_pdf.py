from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from io import BytesIO

def gerar_pdf_orcamento(dados):
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4)
    elements = []
    styles = getSampleStyleSheet()
    
    # Estilos customizados
    title_style = ParagraphStyle(
        'TitleStyle',
        parent=styles['Heading1'],
        fontSize=18,
        alignment=1, # Centralizado
        spaceAfter=20
    )
    
    # Cabeçalho
    elements.append(Paragraph("Orçamento Auto Mecânica Piau", title_style))
    elements.append(Spacer(1, 12))
    
    # Informações do Cliente
    elements.append(Paragraph(f"<b>Cliente:</b> {dados['cliente']['nome']}", styles['Normal']))
    elements.append(Paragraph(f"<b>Telefone:</b> {dados['cliente']['telefone']}", styles['Normal']))
    elements.append(Paragraph(f"<b>Veículo:</b> {dados['cliente']['veiculo']} - <b>Placa:</b> {dados['cliente']['placa']}", styles['Normal']))
    elements.append(Paragraph(f"<b>Data:</b> {dados['cliente']['data']}", styles['Normal']))
    elements.append(Spacer(1, 20))
    
    # Tabela de Peças
    elements.append(Paragraph("<b>Peças e Componentes</b>", styles['Heading2']))
    pecas_data = [["Peça", "Qtd", "V. Unit", "V. Total"]]
    for peca in dados['pecas']:
        pecas_data.append([
            peca['nome'],
            str(peca['quantidade']),
            f"R$ {peca['valor_unitario']:.2f}",
            f"R$ {peca['valor_total']:.2f}"
        ])
    
    pecas_table = Table(pecas_data, colWidths=[250, 50, 100, 100])
    pecas_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 12),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
        ('GRID', (0, 0), (-1, -1), 1, colors.black)
    ]))
    elements.append(pecas_table)
    elements.append(Paragraph(f"<b>Total das Peças: R$ {dados['total_pecas']:.2f}</b>", styles['Normal']))
    elements.append(Spacer(1, 20))
    
    # Mão de Obra
    elements.append(Paragraph("<b>Serviços e Mão de Obra</b>", styles['Heading2']))
    elements.append(Paragraph(f"<b>Descrição:</b> {dados['mao_de_obra']['descricao']}", styles['Normal']))
    elements.append(Paragraph(f"<b>Valor da Mão de Obra:</b> R$ {dados['mao_de_obra']['valor']:.2f}", styles['Normal']))
    elements.append(Spacer(1, 20))
    
    # Total Geral
    elements.append(Paragraph(f"<b>VALOR TOTAL DO ORÇAMENTO: R$ {dados['total_geral']:.2f}</b>", title_style))
    
    doc.build(elements)
    buffer.seek(0)
    return buffer
