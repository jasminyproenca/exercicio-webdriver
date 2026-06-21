# 🚀 Pipeline CI/CD com GitHub Actions — Testes Automatizados com Selenium

[![CI — Testes Automatizados](https://github.com/jasminyproenca/exercicio-webdriver/actions/workflows/ci.yml/badge.svg)](https://github.com/jasminyproenca/exercicio-webdriver/actions/workflows/ci.yml)

Projeto de **Integração Contínua (CI)** desenvolvido como trabalho de conclusão da Disciplina de "Integração Contínua" da pós-graduação em Automação de Testes, utilizando **GitHub Actions** para automatizar a execução de testes E2E com **Selenium WebDriver**.

**Observação:**
- Um dos requisitos do trabalho era utilizar um projeto desenvolvido em outra disciplina da pós-graduação.
- Escolhei o projeto "exercicio-webdriver" - que contém testes automatizados do fluxo de login no site quick-notes.club com Selenium WebDriver, utilizando o framework Mocha e o relatório Mochawesome para gerar relatórios HTML - desenvolvido na disciplina de "Programação para Automação de Testes" (Prof. Júlio de Lima).

---

## 📋 Índice

- [Conceitos Utilizados](#-conceitos-utilizados)
- [Tecnologias](#-tecnologias)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [A Pipeline](#-a-pipeline)
  - [Triggers](#triggers-gatilhos)
  - [Steps](#steps-etapas)
- [Relatório de Testes](#-relatório-de-testes)
- [Como Executar Localmente](#-como-executar-localmente)
- [Como Executar Manualmente no GitHub](#-como-executar-manualmente-no-github)

---

## 📚 Conceitos Utilizados

### CI/CD (Integração Contínua / Entrega Contínua)

**CI (Continuous Integration)** é a prática de integrar e validar alterações de código automaticamente, de forma frequente. Sempre que um desenvolvedor faz um `push`, a pipeline é acionada, executando os testes e garantindo que o código está funcionando corretamente — antes de chegar à produção.

**CD (Continuous Delivery/Deployment)** é a extensão da CI, onde o software validado é automaticamente entregue ou implantado em um ambiente. Neste projeto, o foco está na etapa de CI.

**Benefícios:**
- Detecção precoce de bugs
- Feedback rápido para o desenvolvedor
- Maior confiabilidade nas entregas
- Redução de retrabalho

---

### GitHub Actions

**GitHub Actions** é a plataforma de CI/CD nativa do GitHub. Ela permite automatizar fluxos de trabalho diretamente no repositório, usando arquivos YAML para definir as pipelines.

**Conceitos-chave:**

| Conceito | Descrição |
|---|---|
| **Workflow** | Processo automatizado definido em um arquivo `.yml` dentro de `.github/workflows/` |
| **Trigger (on)** | Evento que dispara o workflow (push, schedule, manual) |
| **Job** | Conjunto de steps que rodam em uma mesma máquina virtual |
| **Step** | Tarefa individual dentro de um job (um comando ou uma action) |
| **Action** | Componente reutilizável que encapsula lógica complexa (ex: `actions/checkout@v4`) |
| **Runner** | Máquina virtual onde o job é executado (ex: `ubuntu-latest`) |
| **Artifact** | Arquivo gerado pela pipeline e armazenado para download posterior |

---

### Testes Automatizados com Selenium WebDriver

**Selenium WebDriver** é uma ferramenta para automatizar interações com navegadores web. Permite simular ações reais de um usuário (clicar, digitar, navegar) para validar o comportamento de uma aplicação.

**Modo Headless:** Em ambientes de CI não existe interface gráfica (sem tela). Para que o Chrome funcione nesses ambientes, ele é iniciado em modo **headless** — executando normalmente, mas sem renderizar a janela visualmente. Isso é ativado automaticamente quando a variável de ambiente `CI=true` está presente (definida pelo GitHub Actions).

---

### Cron (Execução Agendada)

A expressão **cron** define um agendamento recorrente para execução automática da pipeline:

```
┌─── minuto   (0  = no minuto zero, em ponto)
│ ┌─ hora UTC (16 = 16:00 UTC = 13:00 horário de Brasília)
│ │ ┌ dia do mês (* = todo dia)
│ │ │ ┌ mês (* = todo mês)
│ │ │ │ ┌ dia da semana (* = qualquer dia)
0 16 * * *
```

> ⚠️ O GitHub Actions usa **UTC-3**. O horário de Brasília (BRT) é **UTC+3**, então 13:00 BRT = 16:00 UTC.

---

## 🛠 Tecnologias

| Tecnologia | Versão | Função |
|---|---|---|
| Node.js | 20 LTS | Ambiente de execução JavaScript |
| Mocha | ^11.7.6 | Framework de testes |
| Selenium WebDriver | ^4.44.0 | Automação de browser |
| Mochawesome | ^7.1.4 | Geração de relatório HTML |
| GitHub Actions | — | Plataforma de CI/CD |

---

## 📁 Estrutura do Projeto

```
exercicio-webdriver/
├── .github/
│   └── workflows/
│       └── ci.yml          # Definição da pipeline GitHub Actions
├── test/
│   └── login.test.js       # Teste automatizado de login com Selenium
├── .gitignore
├── package.json            # Dependências e scripts do projeto
└── README.md
```

---

## ⚙️ A Pipeline

Arquivo: [`.github/workflows/ci.yml`](.github/workflows/ci.yml)

### Triggers (Gatilhos)

A pipeline é acionada por **três formas diferentes**:

#### 1. Push
```yaml
on:
  push:
    branches:
      - '**'   # Qualquer branch
```
Executada automaticamente a cada `git push`, garantindo validação contínua do código.

#### 2. Execução Manual (`workflow_dispatch`)
```yaml
  workflow_dispatch:
```
Permite iniciar a pipeline manualmente pela interface do GitHub, útil para validações pontuais sem precisar fazer um novo push.

#### 3. Agendamento (`schedule`)
```yaml
  schedule:
    - cron: '0 16 * * *'   # 13:00 horário de Brasília
```
Executa automaticamente todo dia às 13:00 (horário de Brasília), garantindo monitoramento contínuo mesmo sem novas alterações no código.

---

### Steps (Etapas)

```
📥 Checkout do código
    └─ Baixa o código do repositório para a máquina virtual

⚙️  Configurar Node.js 20
    └─ Instala o Node.js com cache de pacotes npm

🌐 Instalar Chrome + ChromeDriver
    └─ Instala versões compatíveis do browser e do driver

📦 Instalar dependências
    └─ Executa npm ci (instalação determinística via package-lock.json)

🧪 Executar testes
    └─ Roda npm run test:ci com reporter Mochawesome

📊 Publicar relatório
    └─ Salva o relatório HTML como artifact (disponível por 30 dias)
```

---

## 📊 Relatório de Testes

O relatório é gerado automaticamente pelo **Mochawesome** a cada execução da pipeline.

### Como acessar o relatório

1. Acesse a aba **Actions** no repositório do GitHub
2. Clique na execução desejada
3. Role até a seção **Artifacts**
4. Clique em **relatorio-testes** para baixar o `.zip`
5. Extraia e abra o arquivo `relatorio-testes.html` no navegador

O relatório inclui:
- ✅ Testes que passaram
- ❌ Testes que falharam (com mensagem de erro)
- ⏱️ Tempo de execução de cada teste
- 📈 Taxa de sucesso geral

---

## 💻 Como Executar Localmente

### Pré-requisitos
- Node.js 20+
- Google Chrome instalado

### Instalação
```bash
git clone https://github.com/jasminyproenca/exercicio-webdriver.git
cd exercicio-webdriver
npm install
```

### Executar testes (modo normal — abre o Chrome)
```bash
npm test
```

### Executar testes com relatório (modo CI — headless)
```bash
CI=true npm run test:ci
```

O relatório será gerado em `mochawesome-report/relatorio-testes.html`.

---

## ▶️ Como Executar Manualmente no GitHub

1. Acesse o repositório em **github.com/jasminyproenca/exercicio-webdriver**
2. Clique na aba **Actions**
3. Selecione o workflow **"CI — Testes Automatizados"** na barra lateral
4. Clique no botão **"Run workflow"**
5. Confirme clicando em **"Run workflow"** (botão verde)

A pipeline será iniciada em segundos e o resultado ficará disponível na mesma tela.

---

## 👩‍💻 Autora

**Jasminy Proença**  
Pós-Graduação em Engenharia de Software  
Disciplina: DevOps & CI/CD
