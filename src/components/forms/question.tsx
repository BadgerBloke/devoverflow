"use client";

import { KeyboardEvent, useRef, useState } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { ControllerRenderProps, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { Editor } from "@tinymce/tinymce-react";

import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { useTheme } from "~/context/theme-provider";
import { createQuestion, editQuestion } from "~/lib/actions/question.action";
import { QuestionSchema, QuestionType } from "~/lib/validations";

import { Badge } from "../ui/badge";

type FieldType = ControllerRenderProps<
  { title: string; content: string; tags: string[] },
  "tags"
>;

interface Props {
  type?: "create" | "edit";
  mongoUserId: string;
  questionDetails?: string;
}

const Question = ({ type = "create", mongoUserId, questionDetails }: Props) => {
  const editorRef = useRef(null);
  const { mode } = useTheme();
  const [isSubmitting, setSubmitting] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const parsedQuestionDetails = JSON.parse(questionDetails || "{}");
  const groupedTags = parsedQuestionDetails.tags?.map(
    (tag: { name: string }) => tag.name
  );

  const form = useForm<QuestionType>({
    resolver: zodResolver(QuestionSchema),
    defaultValues: {
      title: parsedQuestionDetails.title || "",
      content: parsedQuestionDetails.content || "",
      tags: groupedTags || [],
    },
  });

  const handleInputKeyDown = (
    e: KeyboardEvent<HTMLInputElement>,
    field: FieldType
  ) => {
    console.log("Pressed Key: ", e.key);
    if (e.key.toLowerCase() === "enter" && field.name === "tags") {
      e.preventDefault();

      const tagInput = e.target as HTMLInputElement;
      const tagValue = tagInput.value;
      console.log("Tags value: ", tagValue);
      try {
        form.setValue("tags", [...field.value, tagValue]);
        tagInput.value = "";
        QuestionSchema.pick({ tags: true }).parse([...field.value, tagValue]);
      } catch (err) {
        // form.trigger("tags");
      }
    }
  };

  const handleTagRemove = (tag: string, field: FieldType) => {
    if (type !== "edit") {
      const newTags = field.value.filter((t) => t !== tag);
      form.setValue("tags", newTags);
    }
  };

  const onSubmit = async (values: QuestionType) => {
    setSubmitting(true);
    try {
      if (type === "edit") {
        await editQuestion({
          questionId: parsedQuestionDetails._id,
          title: values.title,
          content: values.content,
          path: pathname,
        });
        router.push(`/question/${parsedQuestionDetails._id}`);
      } else {
        await createQuestion({
          ...values,
          author: JSON.parse(mongoUserId),
          path: pathname,
        });
        router.push("/");
      }
    } catch (error) {
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-10"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-3">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Question Title{" "}
                <span className="mt-3.5 text-primary-500">*</span>
              </FormLabel>
              <FormControl className="mt-3.5">
                <Input
                  placeholder="Add a title"
                  className="no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-14 border"
                  {...field}
                />
              </FormControl>
              <FormDescription className="body-regular mt-2.5 text-light-500">
                Be specific and imagine you&apos;re asking a question to another
                person.
              </FormDescription>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-3">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Detailed explanation of your problem{" "}
                <span className="mt-3.5 text-primary-500">*</span>
              </FormLabel>
              <FormControl className="mt-3.5">
                <Editor
                  apiKey={process.env.NEXT_PUBLIC_TINY_EDITOR_API_KEY}
                  onInit={(evt, editor) => {
                    // @ts-ignore
                    editorRef.current = editor;
                  }}
                  initialValue={parsedQuestionDetails.content || ""}
                  onBlur={field.onBlur}
                  onEditorChange={(content) => field.onChange(content)}
                  init={{
                    height: 500,
                    menubar: false,
                    plugins: [
                      "advlist",
                      "autolink",
                      "lists",
                      "link",
                      "image",
                      "charmap",
                      "preview",
                      "anchor",
                      "searchreplace",
                      "visualblocks",
                      "codesample",
                      "fullscreen",
                      "insertdatetime",
                      "media",
                      "table",
                    ],
                    toolbar:
                      "undo redo | " +
                      "codesample | bold italic forecolor | alignleft aligncenter " +
                      "alignright alignjustify | bullist numlist",
                    content_style: "body { font-family:Inter; font-size:16px }",
                    skin: mode === "dark" ? "oxide-dark" : "oxide",
                    content_css: mode === "dark" ? "dark" : "light",
                  }}
                />
              </FormControl>
              <FormDescription className="body-regular mt-2.5 text-light-500">
                Introduce the problem and expand on what you put in the title.
                Minimum 100 characters.
              </FormDescription>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-3">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Tags <span className="mt-3.5 text-primary-500">*</span>
              </FormLabel>
              <FormControl className="mt-3.5">
                <Input
                  disabled={type === "edit"}
                  placeholder="Add tags..."
                  className="no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-14 border"
                  onKeyDown={(e) => handleInputKeyDown(e, field)}
                />
              </FormControl>
              {field.value.length > 0 && (
                <div className="flex-start mt-2.5 gap-2.5">
                  {field.value.map((tag) => (
                    <Badge
                      className="subtle-medium background-light800_dark300 text-light400_light500 flex items-center justify-center gap-2 rounded-md border-none px-4 py-2 capitalize"
                      key={tag}
                      onClick={() => handleTagRemove(tag, field)}
                    >
                      {tag}
                      {type !== "edit" && (
                        <Image
                          src="/assets/icons/close.svg"
                          alt="Close icon"
                          width={12}
                          height={12}
                          className="cursor-pointer object-contain invert-0 dark:invert"
                        />
                      )}
                    </Badge>
                  ))}
                </div>
              )}
              <FormDescription className="body-regular mt-2.5 text-light-500">
                Add up to 3 tags to describe what your question is about. You
                need to press enter to add a tag.
              </FormDescription>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <Button
          className="primary-gradient w-fit !text-light-900"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting
            ? type === "edit"
              ? "Editing..."
              : "Posting..."
            : type === "edit"
              ? "Edit Question"
              : "Ask a Question"}
        </Button>
      </form>
    </Form>
  );
};

export default Question;
