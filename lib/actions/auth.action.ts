"use server";

import { auth, db } from "@/firebase/admin";
import { cookies } from "next/headers";

// Session duration (1 week)
const SESSION_DURATION = 60 * 60 * 24 * 7;

export async function signUp(params: SignUpParams) {
  const { uid, name, email } = params;

  try {
    // check if user exists in db
    const userRecord = await db.collection("users").doc(uid).get();
    if (userRecord.exists)
      return {
        success: false,
        message: "User already exists. Please sign in.",
      };

    // save user to db
    await db.collection("users").doc(uid).set({
      name,
      email,
      // profileURL,
      // resumeURL,
    });

    return{
        success : true,
        message: 'Account created successfully. Please sign in.'
    }

  } catch (e: any) {
    console.error("Error creating a user", e);

    if (e.code === "auth/email-already-exists") {
      return {
        success: false,
        message: "This email is already in use.",
      };
    }

    return {
      success: false,
      message: 'Failed to create an account'
    }
  }
}

// export async function signIn(params: SignInParams) {
//     const { email, idToken } = params;

//     try {
//       const userRecord = await auth.getUserByEmail(email);
//       if (!userRecord)
//         return {
//           success: false,
//           message: "User does not exist. Create an account.",
//         };

//       await setSessionCookie(idToken);
//     } catch (e) {
//       console.log(e);

//       return {
//         success: false,
//         message: "Failed to log into account. Please try again.",
//       };
//     }
//   }



export async function signIn(params: SignInParams) {
  const { idToken } = params;

  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    const uid = decodedToken.uid;

    const userRecord = await db.collection("users").doc(uid).get();
    if (!userRecord.exists) {
      return {
        success: false,
        message: "User not found in database. Please sign up again.",
      };
    }

    await setSessionCookie(idToken);

    return {
      success: true,
      message: "Signed in successfully",
    };
  } catch (e) {
    console.log("Sign-in error:", e);
    return {
      success: false,
      message: "Failed to log in. Invalid credential or session error.",
    };
  }
}




export async function setSessionCookie(idToken: string) {
  const cookieStore = cookies();

  try {
    const sessionCookie = await auth.createSessionCookie(idToken, {
      expiresIn: SESSION_DURATION * 1000, // 7 days
    });

    cookieStore.set("session", sessionCookie, {
      maxAge: SESSION_DURATION,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
    });
  } catch (error) {
    console.error("setSessionCookie error:", error);
    throw new Error("Failed to create session cookie");
  }
}


