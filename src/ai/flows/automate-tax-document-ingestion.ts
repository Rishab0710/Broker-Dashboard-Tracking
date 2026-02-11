'use server';
/**
 * @fileOverview This file defines a Genkit flow for automating tax document ingestion and categorization.
 * 
 * It includes the following:
 * - `ingestAndCategorizeTaxDocument` -  The function to ingest and categorize tax documents.
 * - `IngestAndCategorizeTaxDocumentInput` - The input type for the function.
 * - `IngestAndCategorizeTaxDocumentOutput` - The output type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IngestAndCategorizeTaxDocumentInputSchema = z.object({
  documentDataUri: z
    .string()
    .describe(
      "The tax document as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  sourceDescription: z
    .string()
    .describe('A description of the source of the document (e.g., broker name).'),
});
export type IngestAndCategorizeTaxDocumentInput = z.infer<
  typeof IngestAndCategorizeTaxDocumentInputSchema
>;

const IngestAndCategorizeTaxDocumentOutputSchema = z.object({
  documentType: z.string().describe('The type of tax document (e.g., 1099-DIV, K-1).'),
  broker: z.string().describe('The broker or institution that issued the document.'),
  taxYear: z.number().describe('The tax year the document pertains to.'),
  confidenceScore: z
    .number()
    .describe(
      'A confidence score (0-1) indicating the accuracy of the categorization.'
    ),
});
export type IngestAndCategorizeTaxDocumentOutput = z.infer<
  typeof IngestAndCategorizeTaxDocumentOutputSchema
>;

export async function ingestAndCategorizeTaxDocument(
  input: IngestAndCategorizeTaxDocumentInput
): Promise<IngestAndCategorizeTaxDocumentOutput> {
  return ingestAndCategorizeTaxDocumentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'ingestAndCategorizeTaxDocumentPrompt',
  input: {schema: IngestAndCategorizeTaxDocumentInputSchema},
  output: {schema: IngestAndCategorizeTaxDocumentOutputSchema},
  prompt: `You are an expert tax document processor. Your task is to analyze a tax document and extract key information, including the document type, the issuing broker, and the relevant tax year.  Also provide a confidence score (0-1) for the accuracy of the categorization.

  Document Source: {{{sourceDescription}}}
  Tax Document: {{media url=documentDataUri}}

  Return the output in JSON format.
  `,
});

const ingestAndCategorizeTaxDocumentFlow = ai.defineFlow(
  {
    name: 'ingestAndCategorizeTaxDocumentFlow',
    inputSchema: IngestAndCategorizeTaxDocumentInputSchema,
    outputSchema: IngestAndCategorizeTaxDocumentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
