import { supabase } from "./supabase-config.js";


const createButton =
    document.getElementById("createButton");

const chatName =
    document.getElementById("chatName");

const result =
    document.getElementById("result");

const inviteCode =
    document.getElementById("inviteCode");

const inviteLink =
    document.getElementById("inviteLink");

const copyButton =
    document.getElementById("copyButton");

const errorBox =
    document.getElementById("error");


/* =========================================
   CHECK LOGIN
========================================= */

const {
    data: {
        user
    }
} = await supabase.auth.getUser();


if (!user) {

    window.location.href =
        "login.html";

}


/* =========================================
   CREATE CHAT
========================================= */

createButton.addEventListener(
    "click",
    async () => {

        errorBox.textContent = "";

        const name =
            chatName.value.trim() ||
            "Private Chat";


        createButton.disabled = true;

        createButton.textContent =
            "Creating...";


        try {

            /*
             * Create chat
             */

            const {
                data: chat,
                error: chatError
            } = await supabase
                .from("chats")
                .insert({

                    name: name,

                    created_by: user.id

                })
                .select()
                .single();


            if (chatError) {

                throw chatError;

            }


            /*
             * Add creator as first member
             */

            const {
                error: memberError
            } = await supabase
                .from("chat_members")
                .insert({

                    chat_id: chat.id,

                    user_id: user.id

                });


            if (memberError) {

                throw memberError;

            }


            /*
             * Generate invite code
             */

            const {
                data: codeData,
                error: codeError
            } = await supabase.rpc(
                "generate_invite_code"
            );


            if (codeError) {

                throw codeError;

            }


            const code =
                codeData;


            /*
             * Create invitation
             */

            const {
                error: inviteError
            } = await supabase
                .from("invitations")
                .insert({

                    chat_id: chat.id,

                    created_by: user.id,

                    invite_code: code,

                    max_uses: 1,

                    used_count: 0,

                    active: true

                });


            if (inviteError) {

                throw inviteError;

            }


            /*
             * Build share link
             */

            const link =
                `${window.location.origin}` +
                `${window.location.pathname.replace(
                    "create-chat.html",
                    "join.html"
                )}` +
                `?code=${code}`;


            inviteCode.textContent =
                code;

            inviteLink.value =
                link;


            result.classList.add("show");


            createButton.textContent =
                "✅ Chat Created";


        } catch (error) {

            console.error(error);

            errorBox.textContent =
                error.message ||
                "Unable to create private chat.";


            createButton.disabled =
                false;

            createButton.textContent =
                "🔐 Create Private Chat";

        }

    }
);


/* =========================================
   COPY LINK
========================================= */

copyButton.addEventListener(
    "click",
    async () => {

        try {

            await navigator.clipboard.writeText(
                inviteLink.value
            );


            copyButton.textContent =
                "✅ Link Copied!";


            setTimeout(() => {

                copyButton.textContent =
                    "📋 Copy Private Link";

            }, 2000);


        } catch {

            inviteLink.select();

            document.execCommand("copy");

        }

    }
);
