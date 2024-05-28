const message = new URL(window.location.href).searchParams.get("message");
const errorMessageElement = document.getElementById("errorMessageElement");
if (!!message && !!errorMessageElement) {
  errorMessageElement.classList.remove();
  errorMessageElement.classList.add(
    "bg-red-200",
    "rounded-sm",
    "px-2",
    "py-1",
    "mt-2",
    "flex",
    "justify-between",
    "items-center",
    "text-red-500"
  );
  errorMessageElement.innerHTML = `<span>${message}</span><button onclick="closeErrorMesage(); return false;" class="p-1">x</button>`;
}

const closeErrorMesage = () => {
  const errorMessageElement = document.getElementById("errorMessageElement");
  errorMessageElement.classList.remove();
  errorMessageElement.classList.add("hidden");
  return false;
};
