const codes = {
    "QRCODE0001": {
        messagePtBr: "Conteúdo do QR Code não definido",
        messageEnUs: "QR Code content not defined"
    }
}

const getCodeObject = (code) => {
    return {
        code,
        messagePtBr: codes[code].messagePtBr,
        messageEnUs: codes[code].messageEnUs
    }
}

module.exports = {
    codes,
    getCodeObject
};