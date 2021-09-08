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
        // TODO: Add check for ID before redirecting (socket emit checkID)
        window.location.href = "/" + codeInput.value;
    }
});
