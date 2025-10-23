declare module "*?raw"
{
    const content: string;
    export default content;
}

declare module '*.md' {
    const content: string;
    export default content;
}

declare module "*.html?raw"
{
    const content: string;
    export default content;
}
