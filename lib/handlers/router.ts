import type { VercelRequest, VercelResponse } from "@vercel/node";
import authLogin from "./auth-login.js";
import authRegister from "./auth-register.js";
import authMe from "./auth-me.js";
import authInviteCoplanner from "./auth-invite-coplanner.js";
import authAcceptCoplanner from "./auth-accept-coplanner.js";
import budgetIndex from "./budget-index.js";
import budgetId from "./budget-id.js";
import checklistIndex from "./checklist-index.js";
import checklistId from "./checklist-id.js";
import guestsIndex from "./guests-index.js";
import guestsId from "./guests-id.js";
import partyTasksIndex from "./party-tasks-index.js";
import partyTasksId from "./party-tasks-id.js";
import photosIndex from "./photos-index.js";
import photosPartyUpload from "./photos-party-upload.js";
import plannerCouples from "./planner-couples.js";
import plannerClientStatus from "./planner-client-status.js";
import wedding from "./wedding.js";
import activity from "./activity.js";
import aiChat from "./ai-chat.js";
import inviteToken from "./invite-token.js";
import familyToken from "./family-token.js";

type Handler = (req: VercelRequest, res: VercelResponse) => Promise<unknown>;

const authHandlers: Record<string, Handler> = {
  login: authLogin,
  register: authRegister,
  me: authMe,
  "invite-coplanner": authInviteCoplanner,
  "accept-coplanner": authAcceptCoplanner,
};

export async function routeApi(
  req: VercelRequest,
  res: VercelResponse,
  segments: string[],
): Promise<unknown> {
  const [resource, ...rest] = segments;

  if (!resource) {
    return res.status(404).json({ error: "Not found" });
  }

  if (resource === "auth") {
    const action = rest[0];
    const handler = action ? authHandlers[action] : undefined;
    if (handler) {
      return handler(req, res);
    }
    return res.status(404).json({ error: "Not found" });
  }

  if (resource === "budget") {
    if (rest[0]) {
      req.query.id = rest[0];
      return budgetId(req, res);
    }
    return budgetIndex(req, res);
  }

  if (resource === "checklist") {
    if (rest[0]) {
      req.query.id = rest[0];
      return checklistId(req, res);
    }
    return checklistIndex(req, res);
  }

  if (resource === "guests") {
    if (rest[0]) {
      req.query.id = rest[0];
      return guestsId(req, res);
    }
    return guestsIndex(req, res);
  }

  if (resource === "party-tasks") {
    if (rest[0]) {
      req.query.id = rest[0];
      return partyTasksId(req, res);
    }
    return partyTasksIndex(req, res);
  }

  if (resource === "photos") {
    if (rest[0] === "party-upload") {
      return photosPartyUpload(req, res);
    }
    return photosIndex(req, res);
  }

  if (resource === "planner") {
    if (rest[0] === "couples") {
      return plannerCouples(req, res);
    }
    if (rest[0] === "client-status") {
      return plannerClientStatus(req, res);
    }
    return res.status(404).json({ error: "Not found" });
  }

  if (resource === "wedding") {
    return wedding(req, res);
  }

  if (resource === "activity") {
    return activity(req, res);
  }

  if (resource === "ai") {
    if (rest[0] === "chat") {
      return aiChat(req, res);
    }
    return res.status(404).json({ error: "Not found" });
  }

  if (resource === "invite") {
    const token = rest[0];
    if (token) {
      req.query.token = token;
      return inviteToken(req, res);
    }
    return res.status(404).json({ error: "Not found" });
  }

  if (resource === "family") {
    const token = rest[0];
    if (token) {
      req.query.token = token;
      return familyToken(req, res);
    }
    return res.status(404).json({ error: "Not found" });
  }

  return res.status(404).json({ error: "Not found" });
}
