"use client";
import { useRef, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { Editor } from "@tinymce/tinymce-react";

import { useTheme } from "~/context/theme-provider";
import { createAnswer } from "~/lib/actions/answer.action";
import { AnswerSchema, AnswerType } from "~/lib/validations";

import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";

interface Props {
  question: string;
  questionId: string;
  authorId: string;
}

const AnswerForm = ({ question, questionId, authorId }: Props) => {
  const editorRef = useRef(null);
  const { mode } = useTheme();
  const pathname = usePathname();
  const [isSubmitting, setSubmitting] = useState(false);
  const [isSubmittingAi, setSubmittingAi] = useState(false);
  const form = useForm<AnswerType>({
    resolver: zodResolver(AnswerSchema),
    defaultValues: {
      answer: "",
    },
  });

  const onSubmit = async (values: AnswerType) => {
    setSubmitting(true);
    try {
      await createAnswer({
        content: values.answer,
        author: JSON.parse(authorId),
        question: JSON.parse(questionId),
        path: pathname,
      });
      form.reset();

      if (editorRef.current) {
        const editor = editorRef.current as any;
        editor.setContent("");
      }
    } catch (error) {
      console.log("error: ", error);
    } finally {
      setSubmitting(false);
    }
  };

  const generateAiAnswer = async () => {
    if (!authorId) return;

    setSubmittingAi(true);

    try {
      // const res = await fetch(
      //   `${process.env.NEXT_PUBLIC_SERVER_URL}/api/chatgpt`,
      //   {
      //     method: "POST",
      //     body: JSON.stringify({ question }),
      //   }
      // );
      const res = {
        reply:
          "In Rust, `String` and `str` are two distinct data types that are related to representing strings but have different characteristics.\n\n1. `String` is a growable, heap-allocated, UTF-8 encoded string data type provided by Rust's standard library. It is mutable and can be modified easily. It is owned and allows for dynamic manipulation and resizing of the underlying string data. `String` is typically used when you need to work with owned, mutable strings that can grow or shrink at runtime.\n\n2. `str`, on the other hand, is an immutable view into a sequence of UTF-8 bytes, which is often referred to as a string slice. It is a reference to a sequence of bytes stored elsewhere in memory. Immutable means that you cannot modify the content of a `str` directly. It is a borrowed type and primarily used for string literals, function parameters, or as a slice of a `String`. String slices are commonly used as a more efficient and ergonomic way to work with string data without incurring the overhead of owning the data.\n\nWhen deciding between `String` and `str`, consider the following guidelines:\n\n- Use `String` when you need a mutable, growable string that you own and can modify.\n- Use `str` when you need to reference a part of a `String` or work with string literals and immutable string data.\n\nNeither `String` nor `str` is getting deprecated in Rust. They serve different purposes and are both widely used in Rust programming. It's important to choose the appropriate type based on your specific use case and requirements.",
      };

      // const aiAnswer = await res.json();
      const aiAnswer = res;

      const formattedAnswer = aiAnswer.reply.replace(/\n/g, "<br />");

      if (editorRef.current) {
        const editor = editorRef.current as any;
        editor.setContent(formattedAnswer);
      }
    } catch (error) {
      console.log("Error: ", error);
    } finally {
      setSubmittingAi(false);
    }
  };
  return (
    <div>
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
        <h4 className="paragraph-semibold text-dark400_light800">
          Write your answer here
        </h4>
        <Button
          className="btn light-border-2 gap-1.5 rounded-md px-4 py-2.5 text-primary-500 shadow-none dark:text-primary-500"
          onClick={generateAiAnswer}
          disabled={isSubmittingAi}
        >
          <Image
            src="/assets/icons/stars.svg"
            height={12}
            width={12}
            alt="stars"
            className={`object-contain ${isSubmittingAi ? "animate-pulse" : ""}`}
          />
          {isSubmittingAi ? "Generating..." : "Generate AI Answer"}
        </Button>
      </div>
      <Form {...form}>
        <form
          className="mt-6 flex w-full flex-col gap-10"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="answer"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col gap-3">
                <FormControl className="mt-3.5">
                  <Editor
                    apiKey={process.env.NEXT_PUBLIC_TINY_EDITOR_API_KEY}
                    onInit={(evt, editor) => {
                      // @ts-ignore
                      editorRef.current = editor;
                    }}
                    initialValue=""
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
                      content_style:
                        "body { font-family:Inter; font-size:16px }",
                      skin: mode === "dark" ? "oxide-dark" : "oxide",
                      content_css: mode === "dark" ? "dark" : "light",
                    }}
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Button
              type="submit"
              className="primary-gradient w-fit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AnswerForm;
