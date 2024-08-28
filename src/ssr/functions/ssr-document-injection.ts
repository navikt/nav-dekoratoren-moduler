import { DecoratorFetchProps } from "../../common/common-types";
import { getDecoratorElements } from "./elements-service";

type InjectWithDocument = DecoratorFetchProps & {
    document: Document;
};

export const injectDecoratorServerSideDocument = async ({
    document,
    ...props
}: InjectWithDocument): Promise<Document> =>
    getDecoratorElements(props).then((elements) => {
        const { head, body } = document;
        head.insertAdjacentHTML("beforeend", elements.DECORATOR_HEAD_ASSETS);
        body.insertAdjacentHTML("afterbegin", elements.DECORATOR_HEADER);
        body.insertAdjacentHTML("beforeend", elements.DECORATOR_FOOTER);
        body.insertAdjacentHTML("beforeend", elements.DECORATOR_SCRIPTS);
        return document;
    });
