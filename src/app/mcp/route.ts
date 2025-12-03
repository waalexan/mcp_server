import { baseURL } from "@/src/baseUrl";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { createMcpHandler } from "mcp-handler";
import z from "zod";

/* ----------------------------- Types ----------------------------- */

interface ContentWidget {
    id: string;
    title: string;
    description: string;
    templateUri: string;
    invoking: string;
    invoked: string;
    html: string;
    mimeType: string;
    widgetDomain: string;
}

/* ----------------------------- Helpers ----------------------------- */

const getHtmlFromPage = async (url: string, path: string): Promise<string> => {
    const response = await fetch(`${url}${path}`);
    return await response.text();
};

const widgetMeta = (widget: ContentWidget) => ({
    "openai/outputTemplate": widget.templateUri,
    "openai/toolInvocation/invoking": widget.invoking,
    "openai/toolInvocation/invoked": widget.invoked,
    "openai/widgetAccessible": false,
    "openai/resultCanProduceWidget": true,
    "openai/widgetDomain": widget.widgetDomain,
} as const);

/* ----------------------------- Handler ----------------------------- */

const handler = createMcpHandler(async (server: McpServer) => {
    const html = await getHtmlFromPage(baseURL, "/");

    const contentWidget: ContentWidget = {
        id: "show_content",
        title: "Content Widget",
        description: "Exiba a home page do aplicativo",
        templateUri: "ui://widget/content-template.html",
        invoking: "Carregando conteúdo do aplicativo...",
        invoked: "Conteúdo carregado",
        html,
        mimeType: "text/html+skybridge",
        widgetDomain: "https://hellena-staging.vercel.app/",
    };

    /* ---------------- Register Resource ---------------- */
    server.registerResource(
        "content-widget",
        contentWidget.templateUri,
        {
            title: contentWidget.title,
            description: contentWidget.description,
            mimeType: contentWidget.mimeType,
            _meta: {
                "openai/widgetDescription": contentWidget.description,
                "openai/widgetPrefersBorder": true,
            },
        },
        async (uri: URL) => ({
            contents: [
                {
                    uri: uri.toString(),
                    mimeType: contentWidget.mimeType,
                    text: `<html>${contentWidget.html}</html>`,
                    _meta: {
                        "openai/widgetDescription": contentWidget.description,
                        "openai/widgetDomain": contentWidget.widgetDomain,
                    },
                },
            ],
        })
    );

    /* ---------------- Register Tool ---------------- */
    server.registerTool(
        contentWidget.id,
        {
            title: contentWidget.title,
            description: "Receba o nome do usuário e retorne a home page com o nome do usuário",
            inputSchema: {
                name: z.string().describe("O nome do usuário"),
            },
            _meta: widgetMeta(contentWidget),
        },
        async ({ name }) => ({
            content: [
                {
                    type: "text",
                    text: `Olá, ${name}! Aqui está sua página personalizada.`,
                },
            ],
            strictedContent: {
                name,
                timestamp: new Date().toISOString(),
            },
            _meta: widgetMeta(contentWidget),
        })
    );
});

/* ----------------------------- Export ----------------------------- */
export const GET = handler;
export const POST = handler;
