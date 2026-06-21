import assert from 'node:assert';
import { Builder, Browser, By, Key, until } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';

describe('Testes do Módulo de Login', function () {
    // Aumenta o limite de tempo do Mocha para 30 segundos (necessário em CI)
    this.timeout(30000);

    it('Deve permitir login quando usar credencias válidas', async () => {
        // Arrange: Criar constantes com credenciais e mensagens esperadas (Preparar)

        // Configura opções do Chrome para rodar em modo headless no ambiente de CI.
        // A variável de ambiente CI é definida automaticamente pelo GitHub Actions.
        const options = new chrome.Options();
        if (process.env.CI) {
            options.addArguments(
                '--headless',             // Sem interface gráfica (necessário em CI)
                '--no-sandbox',           // Necessário para rodar como root em containers
                '--disable-dev-shm-usage' // Evita problemas de memória compartilhada em Linux
            );
        }

        const driver = await new Builder()
            .forBrowser(Browser.CHROME)
            .setChromeOptions(options)
            .build();

        try {
            await driver.get('https://quick-notes.club/');

            // Act: Interagir com a aplicação fazendo login (Interagir)
            await driver.findElement(By.id('login-email')).sendKeys('testador@gmail.com');
            await driver.findElement(By.id('login-password')).sendKeys('12345678', Key.ENTER);

            // Assert: Verificar se o resultado é o esperado (Validar)
            await driver.wait(until.elementIsVisible(driver.findElement(By.id('user-name'))), 5000);
            const saudacao = await driver.findElement(By.id('user-name')).getText();
            assert.equal(saudacao, 'Hi, Testador');
        } finally {
            // Garante que o navegador Chrome será fechado no final do teste
            await driver.quit();
        }
    });
});
