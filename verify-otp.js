```javascript
import { supabase } from "./supabase-config.js";


/* =========================================
   ELEMENTS
========================================= */

const otpInputs =
    document.querySelectorAll(".otp");

const verifyButton =
    document.getElementById("verifyButton");

const resendButton =
    document.getElementById("resendButton");

const messageBox =
    document.getElementById("message");

const emailDisplay =
    document.getElementById("emailDisplay");


/* =========================================
   EMAIL
========================================= */

const email =
    sessionStorage.getItem(
        "privacy_verification_email"
    );


if (!email) {

    window.location.href =
        "signup.html";

}


/* Display email */

emailDisplay.textContent =
    email;


/* =========================================
   MESSAGE
========================================= */

function showMessage(
    message,
    type
) {

    messageBox.textContent =
        message;

    messageBox.className =
        "message " + type;

    messageBox.style.display =
        "block";

}


/* =========================================
   OTP INPUT
========================================= */

otpInputs.forEach(
    (input, index) => {

        input.addEventListener(
            "input",
            () => {

                input.value =
                    input.value
                        .replace(/\D/g, "")
                        .slice(0, 1);


                if (
                    input.value &&
                    index <
                    otpInputs.length - 1
                ) {

                    otpInputs[
                        index + 1
                    ].focus();

                }

            }
        );


        input.addEventListener(
            "keydown",
            (event) => {

                if (
                    event.key === "Backspace" &&
                    !input.value &&
                    index > 0
                ) {

                    otpInputs[
                        index - 1
                    ].focus();

                }

            }
        );

    }
);


/* =========================================
   PASTE OTP
========================================= */

otpInputs[0].addEventListener(
    "paste",
    (event) => {

        event.preventDefault();


        const pasted =
            event.clipboardData
                .getData("text")
                .replace(/\D/g, "")
                .slice(0, 6);


        pasted
            .split("")
            .forEach(
                (digit, index) => {

                    if (otpInputs[index]) {

                        otpInputs[index].value =
                            digit;

                    }

                }
            );


        if (pasted.length === 6) {

            otpInputs[5].focus();

        }

    }
);


/* =========================================
   GET OTP
========================================= */

function getOTP() {

    return Array.from(
        otpInputs
    )
        .map(input => input.value)
        .join("");

}


/* =========================================
   VERIFY
========================================= */

verifyButton.addEventListener(
    "click",
    async () => {

        const token =
            getOTP();


        if (token.length !== 6) {

            showMessage(
                "Please enter the complete 6-digit code.",
                "error"
            );

            return;

        }


        verifyButton.disabled =
            true;

        verifyButton.textContent =
            "Verifying...";


        try {

            const {
                data,
                error
            } = await supabase.auth
                .verifyOtp({

                    email: email,

                    token: token,

                    type: "email"

                });


            if (error) {

                throw error;

            }


            if (!data.session) {

                throw new Error(
                    "Verification succeeded but a session could not be created."
                );

            }


            showMessage(
                "Email verified! Welcome to Privacy 💜",
                "success"
            );


            sessionStorage.removeItem(
                "privacy_verification_email"
            );


            setTimeout(() => {

                window.location.href =
                    "dashboard.html";

            }, 800);


        } catch (error) {

            console.error(
                "OTP ERROR:",
                error
            );


            showMessage(
                error.message ||
                "Invalid or expired verification code.",
                "error"
            );


            verifyButton.disabled =
                false;

            verifyButton.textContent =
                "Verify & Continue";

        }

    }
);


/* =========================================
   RESEND
========================================= */

resendButton.addEventListener(
    "click",
    async () => {

        resendButton.disabled =
            true;

        resendButton.textContent =
            "Sending...";


        try {

            const {
                error
            } = await supabase.auth
                .signInWithOtp({

                    email: email

                });


            if (error) {

                throw error;

            }


            showMessage(
                "A new verification code has been sent 💜",
                "success"
            );


            let seconds = 30;


            const timer =
                setInterval(() => {

                    resendButton.textContent =
                        `Resend in ${seconds}s`;

                    seconds--;


                    if (seconds < 0) {

                        clearInterval(timer);

                        resendButton.disabled =
                            false;

                        resendButton.textContent =
                            "Resend code";

                    }

                }, 1000);


        } catch (error) {

            console.error(
                "RESEND ERROR:",
                error
            );


            showMessage(
                error.message ||
                "Unable to resend the code.",
                "error"
            );


            resendButton.disabled =
                false;

            resendButton.textContent =
                "Resend code";

        }

    }
);


/* Focus first box */

if (otpInputs.length) {

    otpInputs[0].focus();

}
```
