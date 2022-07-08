// Requiero papperteer
console.time("timer");
const puppeteer = require("puppeteer");

//' Ejecutar el software con el comando: node index.js
(async () => {
  //' Configuro el laucher para puppeteer.
  // El objeto 'headless': false. Me permite ver lo que está haciendo desde el navegador.
  // Si elimina el objeto 'headless' no se mostrara el navegador.
  // También se puede cambiar el valor de la propiedad 'headless' a true y este deshabilitar el navegador
  const browser = await puppeteer.launch({ headless: false });

  //! Le digo a papperteer que abra una pestaña en el navegador y guardo esa pestaña en una variable.
  const page = await browser.newPage();

  // Le digo que en la página, guardada en la variable 'page' que ingrese al siguiente link.
  await page.goto("http://www.amazon.es");
  await page.screenshot({ path: "amazon.jpg" }); //' Con 'screenshot' Le digo que saque una captura.
  await page.waitForTimeout(100);

  // Le digo que haga 'click' en un 'ID' puesto en algún lugar del HTML.
  await page.click("#sp-cc-accept");
  await page.screenshot({ path: "amazon1.jpg" }); //' Saco captura.
  await page.waitForTimeout(100);

  // Le digo que escriba un texto. Específico el 'ID' del input y luego escribo el texto que quiero.
  await page.type("#twotabsearchtextbox", "Hola Mundo");
  await page.screenshot({ path: "amazon2.jpg" }); //' Saco captura.
  await page.waitForTimeout(100);

  // Le digo que haga 'click' en un 'input' el cual está adentro de un 'span' y el span está adentro de una 'clase'.
  await page.click(".nav-search-submit span input");
  // Le digo que espere a que aparezca una 'etiqueta' con un 'selector' especificado.
  await page.waitForSelector("[data-component-type=s-product-image]");
  // Le digo que espere 3 segundos. '3000ms = 3s'
  await page.waitForTimeout(3000);
  await page.screenshot({ path: "amazon4.jpg" }); //' Saco captura.

  //! Empiezo a investigar dentro de la página.
  // Pido las url de todos los productos.
  const urls = await page.evaluate(() => {
    const elements = document.querySelectorAll(
      ".s-title-instructions-style h2 a"
    );
    const links = [];

    for (let element of elements) {
      links.push(element.href);
    }
    return links;
  });

  // Creo esta variable para poder acumular la información de los productos.
  const products = [];

  // Creo esta variable para poder indicar cuantas url recorrer.
  let number = 0;

  // Utilizo un for tradicional para poder recorrer y obtener cuantos datos yo quiera.
  //! En caso de querer todas las url de forma automatica, se debe cambiar el metodo for.
  //! También debe colocarse la constante 'urls' adentro de 'page.goto' y eliminar todo lo referente a (number).
  for (let i = 0; i < 2; i++) {
    let oneUrl = urls[number];
    await page.goto(oneUrl);
    await page.waitForTimeout(3000);
    await page.screenshot({ path: `amazon-product${number}.jpg` });

    // Pido que me guarde información de los productos.
    const product = await page.evaluate(() => {
      const tmp = {};
      tmp.title = document.querySelector("#productTitle").innerText;
      tmp.author = document.querySelector(".a-link-normal").innerText;
      return tmp;
    });

    number = 1;
    // Meto esa información a un array declarado anteriormente.
    products.push(product);
  }

  console.table(products);
  // Finalizo la ejecución.
  await browser.close();
})();
console.timeEnd("timer");
