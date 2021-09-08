const codeInput = document.querySelector("#codeInput");
const codeConfirm = document.querySelector("#codeConfirm");

codeInput.addEventListener("input", () => {
    validateGameCode(codeInput.value);
});

function validateGameCode(code) {
    if (code.length < 4) {
        codeConfirm.classList.add("disabled");
        return false;
    } else {
        codeConfirm.classList.remove("disabled");
        return true;
    }
}

codeConfirm.addEventListener("click", () => {
    if (validateGameCode(codeInput.value)) {
        window.location.href = "/" + codeInput.value;
    }
});
