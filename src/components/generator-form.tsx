'use client';

import type { UseFormReturn } from 'react-hook-form';
import type { ThreadGenerationForm as ThreadGenerationFormType } from '@/lib/types';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Wand2 } from 'lucide-react';

interface GeneratorFormProps {
  form: UseFormReturn<ThreadGenerationFormType>;
  onSubmit: (data: ThreadGenerationFormType) => Promise<void>;
  isLoading: boolean;
}

export function GeneratorForm({ form, onSubmit, isLoading }: GeneratorFormProps) {
  const threadLength = form.watch('threadLength');
  const inputType = form.watch('inputType');

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Content Input</CardTitle>
            <CardDescription>Paste your content or provide a URL to automatically generate a social media thread.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Tabs 
              value={inputType} 
              onValueChange={(value) => form.setValue('inputType', value as 'text' | 'url')} 
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="text">From Text</TabsTrigger>
                <TabsTrigger value="url">From URL</TabsTrigger>
              </TabsList>
              <TabsContent value="text" className="mt-4">
                <FormField
                  control={form.control}
                  name="text"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Content</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Paste your long-form content here..."
                          className="min-h-[250px] resize-y"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
              <TabsContent value="url" className="mt-4">
                <FormField
                  control={form.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Video URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://www.youtube.com/watch?v=..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="platform"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Platform</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a platform" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Twitter">Twitter</SelectItem>
                        <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="style"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Style</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a style" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Professional">Professional</SelectItem>
                        <SelectItem value="Casual">Casual</SelectItem>
                        <SelectItem value="Storytelling">Storytelling</SelectItem>
                        <SelectItem value="Educational">Educational</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="threadLength"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Thread Length: {threadLength} posts</FormLabel>
                  <FormControl>
                    <Slider
                      min={5}
                      max={15}
                      step={1}
                      defaultValue={[field.value]}
                      onValueChange={(value) => field.onChange(value[0])}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="targetAudience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target Audience (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Tech enthusiasts, startup founders" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" disabled={isLoading} className="w-full" size="lg">
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Wand2 className="mr-2 h-4 w-4" />
              )}
              Generate Thread
            </Button>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
