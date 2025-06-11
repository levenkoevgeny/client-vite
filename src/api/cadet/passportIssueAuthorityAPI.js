import BaseAPI from "@/api/baseAPIClass"

class passportIssueAuthorityAPI extends BaseAPI {}

export default function getPassportIssueAuthorityAPIInstance() {
  return new passportIssueAuthorityAPI(
    "passport-issue-authority",
    {
      passport_issue_authority__icontains: "",
    },
    { passport_issue_authority: "" },
  )
}
