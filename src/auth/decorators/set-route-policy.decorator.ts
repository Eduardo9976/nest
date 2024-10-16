import {ROUTE_POLICY_KEY} from "../auth.constants";
import {SetMetadata} from "@nestjs/common";
import {RoutePolicies} from "../enum/route-policies.enum";

export const SetRoutePolicy = (policy: RoutePolicies) => SetMetadata(ROUTE_POLICY_KEY, policy);
