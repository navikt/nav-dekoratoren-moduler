import { DecoratorElements, DecoratorFetchProps } from "../../common/common-types";
import { getDecoratorElements } from "./elements-service";

export const fetchDecoratorHtml = async (
    props: DecoratorFetchProps,
): Promise<DecoratorElements> => {
    return getDecoratorElements(props);
};
