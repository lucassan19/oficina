document.addEventListener('DOMContentLoaded', () => {
    const tabelaPecas = document.querySelector('#tabela-pecas tbody');
    const btnAddPeca = document.getElementById('add-peca');
    const pecaNomeInput = document.getElementById('peca-nome');
    const pecaQtdInput = document.getElementById('peca-qtd');
    const pecaValorInput = document.getElementById('peca-valor');
    const maoDeObraInput = document.getElementById('mao-de-obra-valor');
    
    const displayTotalPecas = document.getElementById('total-pecas-display');
    const displayMaoDeObra = document.getElementById('mao-de-obra-display');
    const displayTotalGeral = document.getElementById('total-geral-display');
    
    let pecas = [];
    
    // Define a data atual no input de data
    const inputData = document.getElementById('data');
    const hoje = new Date().toISOString().split('T')[0];
    inputData.value = hoje;

    // Função para atualizar os totais
    function atualizarTotais() {
        const totalPecas = pecas.reduce((acc, p) => acc + p.valor_total, 0);
        const valorMaoDeObra = parseFloat(maoDeObraInput.value) || 0;
        const totalGeral = totalPecas + valorMaoDeObra;

        displayTotalPecas.textContent = `R$ ${totalPecas.toFixed(2).replace('.', ',')}`;
        displayMaoDeObra.textContent = `R$ ${valorMaoDeObra.toFixed(2).replace('.', ',')}`;
        displayTotalGeral.textContent = `Total Geral: R$ ${totalGeral.toFixed(2).replace('.', ',')}`;
    }

    // Adicionar peça à lista
    btnAddPeca.addEventListener('click', () => {
        const nome = pecaNomeInput.value.trim();
        const qtd = parseInt(pecaQtdInput.value) || 0;
        const valorUnit = parseFloat(pecaValorInput.value) || 0;

        if (nome && qtd > 0 && valorUnit > 0) {
            const valorTotal = qtd * valorUnit;
            const novaPeca = {
                id: Date.now(),
                nome,
                quantidade: qtd,
                valor_unitario: valorUnit,
                valor_total: valorTotal
            };

            pecas.push(novaPeca);
            renderizarTabela();
            atualizarTotais();
            
            // Limpar campos
            pecaNomeInput.value = '';
            pecaQtdInput.value = '1';
            pecaValorInput.value = '';
            pecaNomeInput.focus();
        } else {
            alert('Por favor, preencha todos os campos da peça corretamente.');
        }
    });

    // Renderizar a tabela de peças
    function renderizarTabela() {
        tabelaPecas.innerHTML = '';
        pecas.forEach(peca => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${peca.nome}</td>
                <td>${peca.quantidade}</td>
                <td>R$ ${peca.valor_unitario.toFixed(2).replace('.', ',')}</td>
                <td>R$ ${peca.valor_total.toFixed(2).replace('.', ',')}</td>
                <td><button class="btn-remove" data-id="${peca.id}">Remover</button></td>
            `;
            tabelaPecas.appendChild(row);
        });

        // Adicionar eventos aos botões de remoção
        document.querySelectorAll('.btn-remove').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.getAttribute('data-id'));
                pecas = pecas.filter(p => p.id !== id);
                renderizarTabela();
                atualizarTotais();
            });
        });
    }

    // Atualizar totais quando mudar o valor da mão de obra
    maoDeObraInput.addEventListener('input', atualizarTotais);

    // Coletar todos os dados do formulário
    function coletarDados() {
        return {
            cliente: {
                nome: document.getElementById('nome').value || 'Não informado',
                telefone: document.getElementById('telefone').value || 'Não informado',
                veiculo: document.getElementById('veiculo').value || 'Não informado',
                placa: document.getElementById('placa').value || 'Não informado',
                data: document.getElementById('data').value
            },
            pecas: pecas,
            mao_de_obra: {
                descricao: document.getElementById('servico-desc').value || 'Não informada',
                valor: parseFloat(maoDeObraInput.value) || 0
            },
            total_geral: pecas.reduce((acc, p) => acc + p.valor_total, 0) + (parseFloat(maoDeObraInput.value) || 0)
        };
    }

    // Botão PDF
    document.getElementById('btn-pdf').addEventListener('click', async () => {
        const dados = coletarDados();
        const response = await fetch('/gerar_pdf', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });
        
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `orcamento_${dados.cliente.nome}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
    });

    // Botão Word
    document.getElementById('btn-word').addEventListener('click', async () => {
        const dados = coletarDados();
        const response = await fetch('/gerar_word', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });
        
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `orcamento_${dados.cliente.nome}.docx`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
    });

    // Botão Imprimir
    document.getElementById('btn-imprimir').addEventListener('click', () => {
        window.print();
    });
});
