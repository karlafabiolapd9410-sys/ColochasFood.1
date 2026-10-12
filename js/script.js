/* =========================================================
   Colocha's Food - JavaScript
   Funcionalidades:
   1. Menú responsive
   2. Botón "Volver arriba"
   3. Carrusel de fotografías
   4. Galería interactiva (visor de imágenes)
   5. Preguntas frecuentes desplegables
   6. Validación del formulario de contacto
   7. Botones de pedido por WhatsApp
   8. Año automático en el pie de página
   ========================================================= */

// Número de WhatsApp en formato internacional (506 = Costa Rica), sin + ni espacios
const NUMERO_WHATSAPP = "50662954649";

document.addEventListener("DOMContentLoaded", () => {
  iniciarMenu();
  iniciarBotonArriba();
  iniciarCarrusel();
  iniciarVisor();
  iniciarPreguntas();
  iniciarFormulario();
  iniciarPedidos();
  document.getElementById("anio").textContent = new Date().getFullYear();
});

/* ---------- 1. Menú responsive ---------- */
function iniciarMenu() {
  const boton = document.getElementById("menuBoton");
  const menu = document.getElementById("menuNav");

  function cerrar() {
    menu.classList.remove("abierto");
    boton.setAttribute("aria-expanded", "false");
    boton.setAttribute("aria-label", "Abrir menú");
  }

  boton.addEventListener("click", () => {
    const abierto = menu.classList.toggle("abierto");
    boton.setAttribute("aria-expanded", String(abierto));
    boton.setAttribute("aria-label", abierto ? "Cerrar menú" : "Abrir menú");
  });

  // Al tocar un enlace, el menú se cierra
  menu.querySelectorAll("a").forEach((enlace) => enlace.addEventListener("click", cerrar));

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") cerrar();
  });
}

/* ---------- 2. Botón volver arriba ---------- */
function iniciarBotonArriba() {
  const boton = document.getElementById("botonArriba");

  window.addEventListener("scroll", () => {
    boton.hidden = window.scrollY < 400;
  });

  boton.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* ---------- 3. Carrusel de fotografías ---------- */
function iniciarCarrusel() {
  const pista = document.getElementById("carruselPista");
  const diapositivas = pista.querySelectorAll(".carrusel__diapositiva");
  const contenedorPuntos = document.getElementById("carruselPuntos");
  let actual = 0;

  // Se crea un punto por cada foto
  const puntos = Array.from(diapositivas).map((_, i) => {
    const punto = document.createElement("button");
    punto.type = "button";
    punto.className = "carrusel__punto";
    punto.setAttribute("aria-label", "Ir a la foto " + (i + 1));
    punto.addEventListener("click", () => mostrar(i));
    contenedorPuntos.appendChild(punto);
    return punto;
  });

  function mostrar(indice) {
    actual = (indice + diapositivas.length) % diapositivas.length;
    pista.style.transform = "translateX(-" + actual * 100 + "%)";
    puntos.forEach((p, i) => p.setAttribute("aria-current", String(i === actual)));
  }

  document.getElementById("carruselAnterior").addEventListener("click", () => mostrar(actual - 1));
  document.getElementById("carruselSiguiente").addEventListener("click", () => mostrar(actual + 1));

  mostrar(0);
}

/* ---------- 4. Galería interactiva (visor) ---------- */
function iniciarVisor() {
  const visor = document.getElementById("visor");
  const imagenVisor = document.getElementById("visorImagen");
  const texto = document.getElementById("visorTexto");
  const fotos = Array.from(document.querySelectorAll("#galeriaLista img"));
  let actual = 0;

  function mostrar(indice) {
    actual = (indice + fotos.length) % fotos.length;
    imagenVisor.src = fotos[actual].src;
    imagenVisor.alt = fotos[actual].alt;
    texto.textContent = fotos[actual].alt;
  }

  fotos.forEach((foto, i) => {
    foto.closest("button").addEventListener("click", () => {
      mostrar(i);
      visor.showModal();
    });
  });

  document.getElementById("visorCerrar").addEventListener("click", () => visor.close());
  document.getElementById("visorAnterior").addEventListener("click", () => mostrar(actual - 1));
  document.getElementById("visorSiguiente").addEventListener("click", () => mostrar(actual + 1));

  // Cerrar al tocar fuera de la ventana
  visor.addEventListener("click", (e) => {
    if (e.target === visor) visor.close();
  });

  // Flechas del teclado
  visor.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") mostrar(actual - 1);
    if (e.key === "ArrowRight") mostrar(actual + 1);
  });
}

/* ---------- 5. Preguntas frecuentes ---------- */
function iniciarPreguntas() {
  document.querySelectorAll(".faq__pregunta").forEach((boton) => {
    boton.addEventListener("click", () => {
      const respuesta = document.getElementById(boton.getAttribute("aria-controls"));
      const abierta = boton.getAttribute("aria-expanded") === "true";

      boton.setAttribute("aria-expanded", String(!abierta));
      respuesta.hidden = abierta;
      boton.querySelector("span").textContent = abierta ? "+" : "−";
    });
  });
}

/* ---------- 6. Validación del formulario ---------- */
function iniciarFormulario() {
  const form = document.getElementById("formContacto");
  const estado = document.getElementById("formEstado");

  const campos = {
    nombre: {
      input: document.getElementById("nombre"),
      error: document.getElementById("error-nombre"),
      validar(valor) {
        if (valor.length === 0) return "Escribe tu nombre.";
        if (valor.length < 3) return "El nombre debe tener al menos 3 letras.";
        return "";
      },
    },
    correo: {
      input: document.getElementById("correo"),
      error: document.getElementById("error-correo"),
      validar(valor) {
        if (valor.length === 0) return "Escribe tu correo.";
        const formatoCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        if (!formatoCorreo.test(valor)) return "Escribe un correo válido, por ejemplo nombre@correo.com.";
        return "";
      },
    },
    mensaje: {
      input: document.getElementById("mensaje"),
      error: document.getElementById("error-mensaje"),
      validar(valor) {
        if (valor.length === 0) return "Escribe tu mensaje.";
        if (valor.length < 10) return "El mensaje debe tener al menos 10 caracteres.";
        if (valor.length > 500) return "El mensaje no puede pasar de 500 caracteres.";
        return "";
      },
    },
  };

  // Revisa un campo y muestra u oculta su error
  function revisar(campo) {
    const mensajeError = campo.validar(campo.input.value.trim());
    campo.error.textContent = mensajeError;
    campo.input.classList.toggle("invalido", mensajeError !== "");
    campo.input.setAttribute("aria-invalid", String(mensajeError !== ""));
    return mensajeError === "";
  }

  Object.values(campos).forEach((campo) => {
    campo.input.addEventListener("blur", () => revisar(campo));
    campo.input.addEventListener("input", () => {
      if (campo.input.classList.contains("invalido")) revisar(campo);
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    estado.textContent = "";

    // Se revisan todos los campos (sin cortar en el primero que falle)
    const resultados = Object.values(campos).map(revisar);
    if (resultados.includes(false)) {
      estado.textContent = "Revisa los campos marcados.";
      const primero = Object.values(campos).find((c) => c.input.classList.contains("invalido"));
      if (primero) primero.input.focus();
      return;
    }

    // Todo bien: se abre WhatsApp con el mensaje ya escrito
    const texto =
      "Hola, soy " + campos.nombre.input.value.trim() +
      " (" + campos.correo.input.value.trim() + "). " +
      campos.mensaje.input.value.trim();

    window.open(
      "https://wa.me/" + NUMERO_WHATSAPP + "?text=" + encodeURIComponent(texto),
      "_blank",
      "noopener,noreferrer"
    );

    estado.textContent = "¡Gracias! Se abrió WhatsApp para enviar tu mensaje.";
    form.reset();
  });
}

/* ---------- 7. Pedir un platillo por WhatsApp ---------- */
function iniciarPedidos() {
  document.querySelectorAll("[data-pedido]").forEach((enlace) => {
    const producto = enlace.dataset.pedido;
    const mensaje = "Hola, quiero pedir: " + producto + ". ¿Me pueden confirmar disponibilidad?";
    enlace.href = "https://wa.me/" + NUMERO_WHATSAPP + "?text=" + encodeURIComponent(mensaje);
    enlace.target = "_blank";
    enlace.rel = "noopener noreferrer";
  });
}
