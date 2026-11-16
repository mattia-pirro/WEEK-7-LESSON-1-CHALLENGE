class Libro {
  letto = false;

  constructor(titolo, autore, anno) {
    this.id = crypto.randomUUID();
    this.titolo = titolo;
    this.autore = autore;
    this.anno = anno;
  }

  segnaComeLetto() {
    this.letto = true;
  }

  formato() {
    return "cartaceo";
  }
}

class LibroDigitale extends Libro {
  constructor(titolo, autore, anno, dimensioneMb) {
    super(titolo, autore, anno);
    this.dimensioneMb = dimensioneMb;
  }

  formato() {
    return `digitale (${this.dimensioneMb} MB)`;
  }
}

let libri = [];

function renderLibri() {
  const righe = libri.map((l) => {
    const li = document.createElement("li");
    li.className =
      "libro d-flex justify-content-between align-items-center gap-3 bg-white rounded shadow-sm p-3";
    if (l.letto) {
      li.classList.add("letto");
    }
    li.dataset.id = l.id;

    const info = document.createElement("div");
    info.className = "info";

    const titolo = document.createElement("span");
    titolo.className = "fw-bold me-2";
    titolo.textContent = l.titolo;

    const badge = document.createElement("span");
    badge.className = "badge rounded-pill bg-light text-muted";
    badge.textContent = l.formato();

    const meta = document.createElement("p");
    meta.className = "meta fs-6 text-muted";
    meta.textContent = `${l.autore} - ${l.anno}`;

    info.appendChild(titolo);
    info.appendChild(badge);
    info.appendChild(meta);

    const azioni = document.createElement("div");
    azioni.className = "azioni d-flex align-items-center gap-2";

    if (l.letto) {
      azioni.textContent = "✓ letto";
    } else {
      const bottone = document.createElement("button");
      bottone.type = "button";
      bottone.className = "btn btn-sm btn-outline-dark";
      bottone.dataset.azione = "leggi";
      bottone.textContent = "Segna come letto";
      azioni.appendChild(bottone);
    }

    li.appendChild(info);
    li.appendChild(azioni);

    return li;
  });

  document.getElementById("lista-libri").replaceChildren(...righe);
  document.getElementById("contatore").textContent = libri.length;
}

const selectFormato = document.getElementById("formato");
const campoDimensione = document.getElementById("campo-dimensione");
const campoDurata = document.getElementById("campo-durata");

selectFormato.addEventListener("change", (e) => {
  campoDimensione.hidden = e.target.value !== "digitale";
});

const formLibro = document.getElementById("aggiungi-libro");

formLibro.addEventListener("submit", (e) => {
  e.preventDefault();
  const dati = Object.fromEntries(new FormData(e.target));
  const anno = Number(dati.anno);
  let nuovo;

  if (dati.formato === "digitale") {
    nuovo = new LibroDigitale(
      dati.titolo,
      dati.autore,
      anno,
      Number(dati["dimensione-mb"]),
    );
  } else {
    nuovo = new Libro(dati.titolo, dati.autore, anno);
  }

  libri.push(nuovo);
  renderLibri();
  e.target.reset();
  campoDimensione.hidden = true;
  campoDurata.hidden = true;
});

const listaLibri = document.getElementById("lista-libri");

listaLibri.addEventListener("click", (e) => {
  const bottone = e.target.closest("[data-azione='leggi']");
  const id = bottone.closest("li").dataset.id;
  const libro = libri.find((l) => l.id === id);

  if (!bottone) {
    return;
  }

  libro.segnaComeLetto();
  renderLibri();
});
