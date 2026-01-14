// ================= STATES =================
export const STATES = {
  START: "START",
  SELECT_CATEGORY: "SELECT_CATEGORY",
  SELECT_SUBCATEGORY: "SELECT_SUBCATEGORY",
  SELECT_HELP_TYPE: "SELECT_HELP_TYPE",

  SELF_SERVICE: "SELF_SERVICE",
  PHYSICAL: "PHYSICAL",

  JOIN_QUEUE: "JOIN_QUEUE",
  SCHEDULE_CALLBACK: "SCHEDULE_CALLBACK",

  AUTH_REQUIRED: "AUTH_REQUIRED",
  END: "END",
};

// ================= SUB-CATEGORIES =================
export const SUB_CATEGORIES = {
  "Card Services": [
    "Report Lost Card",
    "Manage Card Limit",
    "Link Account to Card",
    "Lock / Unlock Card",
  ],
  "Account & Banking": [
    "Reset Login PIN",
    "Check Balance",
    "Update Personal Details",
  ],
  "Loan & Finances": [
    "Loan Eligibility",
    "Interest Rates",
    "Repayment Schedule",
  ],
};

// ================= HELPERS =================
function isValidOption(input, options) {
  return options?.includes(input);
}

// ================= FSM =================
export function handleFlow(session, input) {
  const { state, data } = session;

  switch (state) {
    // --------------------------------------------------
    // START
    // --------------------------------------------------
    case STATES.START:
      return {
        nextState: STATES.SELECT_CATEGORY,
        message: "Please select an enquiry category.",
        options: Object.keys(SUB_CATEGORIES),
      };

    // --------------------------------------------------
    // CATEGORY
    // --------------------------------------------------
    case STATES.SELECT_CATEGORY:
      if (!isValidOption(input, Object.keys(SUB_CATEGORIES))) {
        return null;
      }

      return {
        nextState: STATES.SELECT_SUBCATEGORY,
        message: `You selected **${input}**. Please choose a sub-category.`,
        options: SUB_CATEGORIES[input],
        data: {
          category: input,
        },
      };

    // --------------------------------------------------
    // SUB-CATEGORY
    // --------------------------------------------------
    case STATES.SELECT_SUBCATEGORY: {
      const category = data.category;
      const validOptions = SUB_CATEGORIES[category];

      if (!isValidOption(input, validOptions)) {
        return null;
      }

      return {
        nextState: STATES.SELECT_HELP_TYPE,
        message: `You selected **${input}**. How would you like to get help?`,
        options: ["Self-service", "Physical Consultation", "Online Agent"],
        data: {
          subCategory: input,
        },
      };
    }

    // --------------------------------------------------
    // HELP TYPE
    // --------------------------------------------------
    case STATES.SELECT_HELP_TYPE:
      if (
        !isValidOption(input, [
          "Self-service",
          "Physical Consultation",
          "Online Agent",
        ])
      ) {
        return null;
      }

      if (input === "Self-service") {
        return {
          nextState: STATES.SELF_SERVICE,
          message: "Here is a self-service tutorial to help you.",
          data: { helpType: "Self-service" },
        };
      }

      if (input === "Physical Consultation") {
        return {
          nextState: STATES.PHYSICAL,
          message:
            "You may visit a nearby branch. A QR code can be generated for you.",
          data: { helpType: "Physical Consultation" },
        };
      }

      if (input === "Online Agent") {
        return {
          nextState: STATES.JOIN_QUEUE,
          message: "You will be connected to an online agent shortly.",
          data: { helpType: "Online Agent" },
        };
      }

      return null;

    // --------------------------------------------------
    // SELF SERVICE
    // --------------------------------------------------
    case STATES.SELF_SERVICE:
      return {
        message:
          "Step-by-step guidance is shown here. Did this resolve your issue?",
        options: ["Yes, resolved", "No, I need more help"],
      };

    // --------------------------------------------------
    // PHYSICAL CONSULTATION
    // --------------------------------------------------
    case STATES.PHYSICAL:
      return {
        message:
          "A QR code can be generated for branch consultation. Would you like to proceed?",
        options: ["Generate QR Code", "End Chat"],
      };

    // --------------------------------------------------
    // JOIN QUEUE (login gated in router)
    // --------------------------------------------------
    case STATES.JOIN_QUEUE:
      return {
        message:
          "You are being placed in the queue. Estimated waiting time will be shown.",
      };

    // --------------------------------------------------
    // SCHEDULE CALLBACK
    // --------------------------------------------------
    case STATES.SCHEDULE_CALLBACK:
      return {
        message:
          "Please select an available date and time for callback scheduling.",
      };

    // --------------------------------------------------
    // AUTH REQUIRED
    // --------------------------------------------------
    case STATES.AUTH_REQUIRED:
      return {
        message: "Please log in to continue with this request.",
      };

    // --------------------------------------------------
    // END
    // --------------------------------------------------
    case STATES.END:
      return {
        message: "Thank you for contacting OCBC SmartHelp. Have a great day!",
      };

    default:
      return null;
  }
}
