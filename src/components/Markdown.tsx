import {memo, ReactElement} from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from 'rehype-highlight';

export const Markdown = memo(({tokens}: {
    tokens: string | ReactElement,
}) => {
    if (typeof tokens === 'object') {
        return tokens;
    }
    return <main id='markdown' className='text-gray-300'>
        <ReactMarkdown rehypePlugins={[[rehypeHighlight, {detect: false, ignoreMissing: true,}]]}>
            {tokens}
        </ReactMarkdown>
    </main>
})