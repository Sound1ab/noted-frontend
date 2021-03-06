import React from 'react'
import { Editor } from 'slate'
import { RenderElementProps } from 'slate-react/dist/components/editable'

import { BlockQuote } from '../../../../../atoms/BlockQuote/BlockQuote'
import { CodeBlock } from '../../../../../atoms/CodeBlock/CodeBlock'
import { Heading } from '../../../../../atoms/Heading/Heading'
import { Hr } from '../../../../../atoms/Hr/Hr'
import { Link } from '../../../../../atoms/Link/Link'
import { List } from '../../../../../atoms/List/List'
import { ListItem } from '../../../../../atoms/ListItem/ListItem'
import { Paragraph } from '../../../../../atoms/Paragraph/Paragraph'
import { Table } from '../../../../../atoms/Table/Table'
import { TableCell } from '../../../../../atoms/Table/TableCell/TableCell'
import { TableRow } from '../../../../../atoms/Table/TableRow/TableRow'

interface IElement extends RenderElementProps {
  editor: Editor
  element: {
    url?: string
    header?: boolean
    footer?: boolean
    children: []
    type: string
  }
}

export function Element(props: IElement) {
  const baseElementRenderer: Record<string, JSX.Element> = {
    paragraph: <Paragraph {...props}>{props.children}</Paragraph>,
    heading: <Heading {...props}>{props.children}</Heading>,
    list: <List {...props}>{props.children}</List>,
    listItem: <ListItem {...props}>{props.children}</ListItem>,
    blockquote: <BlockQuote {...props}>{props.children}</BlockQuote>,
    link: (
      <Link {...props} link={props.element.url}>
        {props.children}
      </Link>
    ),
    thematicBreak: <Hr {...props}>{props.children}</Hr>,
    code: <CodeBlock {...props}>{props.children}</CodeBlock>,
    table: <Table {...props}>{props.children}</Table>,
    tableRow: (
      <TableRow
        {...props}
        header={props.element.header}
        footer={props.element.footer}
      >
        {props.children}
      </TableRow>
    ),
    tableCell: (
      <TableCell {...props} header={props.element.header}>
        {props.children}
      </TableCell>
    ),
    // softbreak: () => <span {...attributes}> {children}</span>,
    // linebreak: () => (
    //   <span {...attributes}>
    //     <span contentEditable={false} style={{ userSelect: 'none' }}>
    //       <br />
    //     </span>
    //     {children}
    //   </span>
    // ),
    // html_block: () => <pre {...attributes}>{children}</pre>,
    // image: () => <ImageElement {...props} />,
    // html_inline: () => (
    //   <span {...attributes}>
    //     {(element.data as any).content}
    //     {children}
    //   </span>
    // ),
  }

  const component = baseElementRenderer[props.element.type]

  if (!component) {
    console.log(
      `Didn't know how to render ${JSON.stringify(props.element, null, 2)}`
    )
    return <p {...props.attributes}>{props.children}</p>
  }

  return component
}
