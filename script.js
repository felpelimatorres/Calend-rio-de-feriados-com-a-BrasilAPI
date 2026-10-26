// Atividade 1 - Calendário de feriados com a BrasilAPI
// Aluno(a): ________________________

const campoAno = document.getElementById('ano')
const tabela = document.getElementById('tabelaFeriados')
const mensagem = document.getElementById('mensagem')
const total = document.getElementById('total')
const proximo = document.getElementById('proximo')

const diasDaSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']

// TODO 1: preencher o campo com o ano atual
campoAno.value = new Date().getFullYear()

function consultarFeriados() {
    const ano = campoAno.value
    tabela.innerHTML = ''
    mensagem.innerHTML = ''
    total.innerHTML = ''

    fetch(`https://brasilapi.com.br/api/feriados/v1/${ano}`)
        .then(resposta => {
            // TODO 2: se a API responder com erro, lança um erro para cair no .catch()
            if (!resposta.ok) {
                throw new Error(`Não foi possível encontrar feriados para o ano "${ano}".`)
            }
            return resposta.json()
        })
        .then(feriados => {
            console.log(feriados)

            // TODO 3: total de feriados usando .length
            total.innerHTML = `Total de feriados em ${ano}: <strong>${feriados.length}</strong>`

            feriados.forEach(feriado => {
                // Dica: o 'T12:00:00' evita erro de fuso horario
                const data = new Date(feriado.date + 'T12:00:00')

                // TODO 4: data no padrao brasileiro
                const dataBR = data.toLocaleDateString('pt-BR')

                // TODO 5: dia da semana (getDay() devolve 0 a 6)
                const numeroDia = data.getDay()
                const diaSemana = diasDaSemana[numeroDia]

                // TODO 6: sabado (6) ou domingo (0) recebe a classe 'fim-de-semana'
                let classe = ''
                if (numeroDia === 0 || numeroDia === 6) {
                    classe = 'fim-de-semana'
                }

                tabela.innerHTML += `
                    <tr class="${classe}">
                        <td>${dataBR}</td>
                        <td>${diaSemana}</td>
                        <td>${feriado.name}</td>
                    </tr>`
            })
        })
        .catch(erro => {
            // TODO 7: mostrar a mensagem de erro na pagina (sem usar alert)
            console.log(erro)
            mensagem.innerHTML = erro.message
            mensagem.className = 'erro'
        })
}

// Desafio extra: próximo feriado a partir de hoje e quantos dias faltam
function mostrarProximoFeriado(ano) {
    fetch(`https://brasilapi.com.br/api/feriados/v1/${ano}`)
        .then(resposta => {
            if (!resposta.ok) {
                throw new Error('Erro ao buscar o próximo feriado.')
            }
            return resposta.json()
        })
        .then(feriados => {
            const hoje = new Date()
            hoje.setHours(12, 0, 0, 0)

            let feriadoProximo = null
            feriados.forEach(feriado => {
                const data = new Date(feriado.date + 'T12:00:00')
                if (feriadoProximo === null && data >= hoje) {
                    feriadoProximo = feriado
                }
            })

            // Se não sobrou feriado neste ano, procura no ano seguinte
            if (feriadoProximo === null) {
                mostrarProximoFeriado(ano + 1)
                return
            }

            const data = new Date(feriadoProximo.date + 'T12:00:00')
            const dias = Math.round((data - hoje) / (1000 * 60 * 60 * 24))

            let textoDias = `faltam <strong>${dias}</strong> dias`
            if (dias === 0) {
                textoDias = '<strong>é hoje!</strong>'
            } else if (dias === 1) {
                textoDias = 'falta <strong>1</strong> dia'
            }

            proximo.innerHTML = `
                Próximo feriado: <strong>${feriadoProximo.name}</strong>
                em ${data.toLocaleDateString('pt-BR')} (${diasDaSemana[data.getDay()]}) — ${textoDias}`
        })
        .catch(erro => {
            console.log(erro)
            proximo.innerHTML = erro.message
        })
}

document.getElementById('btnConsultar').addEventListener('click', consultarFeriados)

// Ao abrir a página, já mostra os feriados do ano atual e o próximo feriado
consultarFeriados()
mostrarProximoFeriado(new Date().getFullYear())
