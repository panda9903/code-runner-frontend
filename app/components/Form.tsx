"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ReloadIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Editor from "@monaco-editor/react";
import Loader from "../loader";

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  code_language: z.enum(["cpp", "python", "java", "javascript"], {}),
  stdin: z.string(),
  stdout: z.string(),
  code: z.string().min(1, {
    message: "Please paste your code.",
  }),
});

export function ProfileForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      code_language: "cpp",
      stdin: "",
      stdout: "",
      code: "",
    },
  });

  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);
  const [codeLanguage, setCodeLanguage] = useState("cpp");

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    const res = fetch("https://code-runner-w97q.onrender.com/submissions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });
    console.log(res);
    setSubmitted(true);
    setTimeout(() => {
      router.push("/submissions");
    }, 3000);
  }

  return (
    <div className="flex justify-center items-center flex-col md:px-48 px-10 py-40 ">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 flex flex-col"
        >
          <div className="flex justify-center items-center flex-col">
            <p className=" text-[#e11203] text-6xl font-mono">Code Runner</p>
          </div>
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className=" ">Username</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormDescription className="text-black">
            Choose your preferred language{" "}
          </FormDescription>
          <FormField
            control={form.control}
            name="code_language"
            render={({ field }) => (
              <FormItem className="space-y-3 ">
                <FormControl>
                  <RadioGroup
                    onValueChange={(value) => {
                      field.onChange(value);
                      setCodeLanguage(value);
                      console.log(value);
                    }}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="cpp" />
                      </FormControl>
                      <FormLabel className="font-normal">C++</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="python" />
                      </FormControl>
                      <FormLabel className="font-normal">Python</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="java" />
                      </FormControl>
                      <FormLabel className="font-normal">Java</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="javascript" />
                      </FormControl>
                      <FormLabel className="font-normal">JavaScript</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="stdin"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="">Input</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Paste your input here. Leave empty if not applicable."
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          {/* <FormField
            control={form.control}
            name="stdout"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="">Expected Output</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Paste your input here. Leave empty if not applicable."
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          /> */}
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="">Code</FormLabel>
                <FormControl onChange={field.onChange}>
                  <Editor
                    height="70vh"
                    key={codeLanguage}
                    language={codeLanguage}
                    defaultValue="Please write your code here."
                  />
                </FormControl>
              </FormItem>
            )}
          />
          {submitted ? (
            <Button disabled>
              <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
              <div className="overlay fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex justify-center items-center">
                <Loader />
              </div>
              Compiling your code
            </Button>
          ) : (
            <Button type="submit" className="">
              Submit
            </Button>
          )}
        </form>
      </Form>

      <Link href="/submissions">
        <Button className="mt-6">See submissions</Button>
      </Link>
    </div>
  );
}
