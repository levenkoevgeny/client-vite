import BaseAPI from "@/api/baseAPIClass"

class HealthGroupAPI extends BaseAPI {}

export default function getHealthGroupAPIInstance() {
    return new HealthGroupAPI(
        "health-groups",
        {
            health_group__icontains: ""
        },
        { health_group: "" },
    )
}
