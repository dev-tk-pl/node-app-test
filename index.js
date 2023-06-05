const puppeteer = require('puppeteer');
require('dotenv').config();
const nodemailer = require('nodemailer');


// Adres e-mail i hasło do konta, z którego będziemy wysyłać wiadomości
const email = process.env.EMAIL;
const password = process.env.PASSWORD;

// Adres e-mail odbiorcy
const recipient = process.env.EMAIL;

// Funkcja do wysyłania wiadomości e-mail
async function sendEmail(price) {
  // Utwórz transporter do wysyłki wiadomości
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: email,
      pass: password,
    },
  });

  // Utwórz zawartość wiadomości
  const mailOptions = {
    from: email,
    to: recipient,
    subject: 'Aktualna cena produktu',
    text: `Dysk SSD Lexar NM620 2TB: ${price}`,
  };

  // Wyślij wiadomość
  await transporter.sendMail(mailOptions);
  console.log('E-mail został wysłany!');
}

// Funkcja do pobierania ceny ze strony internetowej
async function getPrice() {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  await page.goto(process.env.PRODUCT_PAGE);

  // Poczekaj na załadowanie się strony
  await page.waitForSelector('#product_price_brutto');

  // Pobierz cenę ze strony
  const priceElement = await page.$('#product_price_brutto');
  console.log('pobieram dane...')
  const price = await page.evaluate(element => element.textContent, priceElement);

  // Zamknij przeglądarkę
  await browser.close();

  return price;
}

// Funkcja do sprawdzania ceny co minutę i wysyłania wiadomości e-mail
async function checkPrice() {
  const price = await getPrice();
  console.log(`Aktualna cena: ${price}`);
  await sendEmail(price);
}

// Uruchom funkcję sprawdzania ceny co minutę
// setInterval(checkPrice, 60000);
setInterval(checkPrice, 3600000);



