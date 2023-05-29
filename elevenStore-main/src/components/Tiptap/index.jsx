import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Color } from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Document from "@tiptap/extension-document";
import Dropcursor from "@tiptap/extension-dropcursor";
import Image from "@tiptap/extension-image";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";

import React, { useCallback } from "react";

import { Divider, Box } from "@mui/material";
import Button from "components/Button";
import {
	BoldIcon,
	CodeViewIcon,
	ItalicIcon,
	StrikethroughIcon,
	UnderlineIcon,
	PIcon,
	H1Icon,
	H2Icon,
	H3Icon,
	H4Icon,
	H5Icon,
	H6Icon,
	OrderedListIcons,
	BulletListIcon,
	CodeBlockIcon,
	BlockquoteIcon,
	HorizontalRuleIcon,
	UndoIcon,
	RedoIcon,
	AlignLeftIcon,
	AlignCenterIcon,
	AlignRightIcon,
	AlignJustifyIcon,
	LineBreakIcon,
	InsertImageIcon,
} from "components/Icons";

const MenuBar = ({ editor }) => {
	const addImage = useCallback(() => {
		const url = window.prompt("URL");

		if (url) {
			editor.chain().focus().setImage({ src: url }).run();
		}
	}, [editor]);

	if (!editor) {
		return null;
	}

	const optionsClassName = {
		isNotActive: `!p-0 !m-0 !rounded-none shadow-none hover:bg-gray-200`,
		isActive: `!p-0 !m-0 !rounded-none shadow-none bg-gradient-to-r from-gray-300 from-10% via-gray-200 via-30% to-gray-300/50 to-50% hover:bg-dark/10`,
	};

	return (
		<Box
			sx={{
				display: "flex",
				flexWrap: "wrap",
				alignItems: "center",
				width: "fit-content",
				border: (theme) => `1px solid ${theme.palette.divider}`,
				borderRadius: 1,
				bgcolor: "background.paper",
				color: "text.secondary",
				"& svg": {
					m: 1.5,
				},
				"& hr": {
					mx: 0.5,
				},
			}}
		>
			<Button
				type="button"
				tooltipTitle="Insert Image"
				inputClassName={`${optionsClassName.isNotActive}`}
				onClick={addImage}
			>
				<InsertImageIcon fontSize="small" />
			</Button>
			<Button
				type="button"
				tooltipTitle="Bold"
				inputClassName={`${
					editor.isActive("bold") ? optionsClassName.isActive : optionsClassName.isNotActive
				}`}
				onClick={() => editor.chain().focus().toggleBold().run()}
				disabled={!editor.can().chain().focus().toggleBold().run()}
			>
				<BoldIcon fontSize="small" />
			</Button>
			<Button
				type="button"
				tooltipTitle="Italic"
				inputClassName={`${
					editor.isActive("italic") ? optionsClassName.isActive : optionsClassName.isNotActive
				}`}
				onClick={() => editor.chain().focus().toggleItalic().run()}
				disabled={!editor.can().chain().focus().toggleItalic().run()}
			>
				<ItalicIcon fontSize="small" />
			</Button>
			<Button
				type="button"
				tooltipTitle="Strikethrough"
				inputClassName={`${
					editor.isActive("strike") ? optionsClassName.isActive : optionsClassName.isNotActive
				}`}
				onClick={() => editor.chain().focus().toggleStrike().run()}
				disabled={!editor.can().chain().focus().toggleStrike().run()}
			>
				<StrikethroughIcon fontSize="small" />
			</Button>
			<Button
				type="button"
				tooltipTitle="Underline"
				onClick={() => editor.chain().focus().toggleUnderline().run()}
				inputClassName={`${
					editor.isActive("underline") ? optionsClassName.isActive : optionsClassName.isNotActive
				}`}
			>
				<UnderlineIcon fontSize="small" />
			</Button>
			<Button
				type="button"
				tooltipTitle="Code"
				inputClassName={`${
					editor.isActive("code") ? optionsClassName.isActive : optionsClassName.isNotActive
				}`}
				onClick={() => editor.chain().focus().toggleCode().run()}
				disabled={!editor.can().chain().focus().toggleCode().run()}
			>
				<CodeViewIcon fontSize="small" />
			</Button>
			{/* <Button
				type="button"
				inputClassName={`${optionsClassName.isNotActive}`}
				onClick={() => editor.chain().focus().unsetAllMarks().run()}
			>
				clear marks
				<FormatStrikethroughIcon fontSize="small" />
			</Button>
			<Button
				type="button"
				inputClassName={`${optionsClassName.isNotActive}`}
				onClick={() => editor.chain().focus().clearNodes().run()}
			>
				clear nodes
				<FormatStrikethroughIcon fontSize="small" />
			</Button> */}
			<Divider orientation="vertical" flexItem />
			<Button
				type="button"
				tooltipTitle="Paragraph"
				inputClassName={`${
					editor.isActive("paragraph") ? optionsClassName.isActive : optionsClassName.isNotActive
				}`}
				onClick={() => editor.chain().focus().setParagraph().run()}
			>
				<PIcon fontSize="small" />
			</Button>
			<Button
				type="button"
				tooltipTitle="Heading 1"
				inputClassName={`${
					editor.isActive("heading", { level: 1 })
						? optionsClassName.isActive
						: optionsClassName.isNotActive
				}`}
				onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
			>
				<H1Icon fontSize="small" />
			</Button>
			<Button
				type="button"
				tooltipTitle="Heading 2"
				inputClassName={`${
					editor.isActive("heading", { level: 2 })
						? optionsClassName.isActive
						: optionsClassName.isNotActive
				}`}
				onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
			>
				<H2Icon fontSize="small" />
			</Button>
			<Button
				type="button"
				tooltipTitle="Heading 3"
				inputClassName={`${
					editor.isActive("heading", { level: 3 })
						? optionsClassName.isActive
						: optionsClassName.isNotActive
				}`}
				onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
			>
				<H3Icon fontSize="small" />
			</Button>
			<Button
				type="button"
				tooltipTitle="Heading 4"
				inputClassName={`${
					editor.isActive("heading", { level: 4 })
						? optionsClassName.isActive
						: optionsClassName.isNotActive
				}`}
				onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
			>
				<H4Icon fontSize="small" />
			</Button>
			<Button
				type="button"
				tooltipTitle="Heading 5"
				inputClassName={`${
					editor.isActive("heading", { level: 5 })
						? optionsClassName.isActive
						: optionsClassName.isNotActive
				}`}
				onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
			>
				<H5Icon fontSize="small" />
			</Button>
			<Button
				type="button"
				tooltipTitle="Heading 6"
				inputClassName={`${
					editor.isActive("heading", { level: 6 })
						? optionsClassName.isActive
						: optionsClassName.isNotActive
				}`}
				onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
			>
				<H6Icon fontSize="small" />
			</Button>
			<Divider orientation="vertical" flexItem />
			<Button
				type="button"
				tooltipTitle="Align Left"
				inputClassName={`${
					editor.isActive({ textAlign: "left" })
						? optionsClassName.isActive
						: optionsClassName.isNotActive
				}`}
				onClick={() => editor.chain().focus().setTextAlign("left").run()}
			>
				<AlignLeftIcon fontSize="small" />
			</Button>
			<Button
				type="button"
				tooltipTitle="Align Center"
				inputClassName={`${
					editor.isActive({ textAlign: "center" })
						? optionsClassName.isActive
						: optionsClassName.isNotActive
				}`}
				onClick={() => editor.chain().focus().setTextAlign("center").run()}
			>
				<AlignCenterIcon fontSize="small" />
			</Button>
			<Button
				type="button"
				tooltipTitle="Align Right"
				inputClassName={`${
					editor.isActive({ textAlign: "right" })
						? optionsClassName.isActive
						: optionsClassName.isNotActive
				}`}
				onClick={() => editor.chain().focus().setTextAlign("right").run()}
			>
				<AlignRightIcon fontSize="small" />
			</Button>
			<Button
				type="button"
				tooltipTitle="Align Justify"
				inputClassName={`${
					editor.isActive({ textAlign: "justify" })
						? optionsClassName.isActive
						: optionsClassName.isNotActive
				}`}
				onClick={() => editor.chain().focus().setTextAlign("justify").run()}
			>
				<AlignJustifyIcon fontSize="small" />
			</Button>
			<Divider orientation="vertical" flexItem />
			<Button
				type="button"
				tooltipTitle="Bullet List"
				inputClassName={`${
					editor.isActive("bulletList") ? optionsClassName.isActive : optionsClassName.isNotActive
				}`}
				onClick={() => editor.chain().focus().toggleBulletList().run()}
			>
				<BulletListIcon fontSize="small" />
			</Button>
			<Button
				type="button"
				tooltipTitle="Ordered List"
				inputClassName={`${
					editor.isActive("orderedList") ? optionsClassName.isActive : optionsClassName.isNotActive
				}`}
				onClick={() => editor.chain().focus().toggleOrderedList().run()}
			>
				<OrderedListIcons fontSize="small" />
			</Button>
			<Button
				type="button"
				tooltipTitle="Code Block"
				inputClassName={`${
					editor.isActive("codeBlock") ? optionsClassName.isActive : optionsClassName.isNotActive
				}`}
				onClick={() => editor.chain().focus().toggleCodeBlock().run()}
			>
				<CodeBlockIcon fontSize="small" />
			</Button>
			<Button
				type="button"
				tooltipTitle="Blockquote"
				inputClassName={`${
					editor.isActive("blockquote") ? optionsClassName.isActive : optionsClassName.isNotActive
				}`}
				onClick={() => editor.chain().focus().toggleBlockquote().run()}
			>
				<BlockquoteIcon fontSize="small" />
			</Button>
			<Button
				type="button"
				tooltipTitle="Horizontal Rule"
				inputClassName={`${optionsClassName.isNotActive}`}
				onClick={() => editor.chain().focus().setHorizontalRule().run()}
			>
				<HorizontalRuleIcon fontSize="small" />
			</Button>
			<Button
				type="button"
				tooltipTitle="Line Break"
				inputClassName={`${optionsClassName.isNotActive}`}
				onClick={() => editor.chain().focus().setHardBreak().run()}
			>
				<LineBreakIcon fontSize="small" />
			</Button>
			{/* <Button
				type="button"
				inputClassName={`${
					editor.isActive("textStyle", { color: "#958DF1" })
						? optionsClassName.isActive
						: optionsClassName.isNotActive
				}`}
				onClick={() => editor.chain().focus().setColor("#958DF1").run()}
			>
				purple
			</Button> */}
			<Button
				type="button"
				tooltipTitle="Undo"
				inputClassName={`${optionsClassName.isNotActive}`}
				onClick={() => editor.chain().focus().undo().run()}
				disabled={!editor.can().chain().focus().undo().run()}
			>
				<UndoIcon fontSize="small" />
			</Button>
			<Button
				type="button"
				tooltipTitle="Redo"
				inputClassName={`${optionsClassName.isNotActive}`}
				onClick={() => editor.chain().focus().redo().run()}
				disabled={!editor.can().chain().focus().redo().run()}
			>
				<RedoIcon fontSize="small" />
			</Button>
		</Box>
	);
};

export default ({ setContent, register }) => {
	const editor = useEditor({
		extensions: [
			Color.configure({ types: [TextStyle.name, ListItem.name] }),
			TextStyle.configure({ types: [ListItem.name] }),
			Paragraph,
			Text,
			StarterKit.configure({
				bulletList: {
					keepMarks: true,
					keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
				},
				orderedList: {
					keepMarks: true,
					keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
				},
			}),
			Underline,
			TextAlign.configure({
				types: ["heading", "paragraph"],
			}),
			Image,
			Dropcursor,
		],
		content: ``,
		onUpdate: ({ editor }) => {
			const html = editor.getHTML();
			setContent(html);
		},
	});

	return (
		<div className="parrenteditor bg-gray-400/10">
			<div className="m-2 flex flex-wrap gap-1">
				<MenuBar editor={editor} />
			</div>
			<EditorContent editor={editor} />
		</div>
	);
};
