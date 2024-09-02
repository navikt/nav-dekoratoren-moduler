import { DecoratorElements, DecoratorFetchProps } from "../../common/common-types";
import { getDecoratorElements } from "./decorator-elements-service";

export const fetchDecoratorHtml = async (
    props: DecoratorFetchProps,
): Promise<DecoratorElements> => {
    return getDecoratorElements(props);
};
