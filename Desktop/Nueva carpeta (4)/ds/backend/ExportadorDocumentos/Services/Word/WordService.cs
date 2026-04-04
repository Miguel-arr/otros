using System;
using System.IO;
using System.Linq;
using System.Text.Json;
using System.Collections.Generic;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Logging;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Wordprocessing;
using DocumentFormat.OpenXml;
using ExportadorDocumentos.Services.Excel;
using A = DocumentFormat.OpenXml.Drawing;
using DW = DocumentFormat.OpenXml.Drawing.Wordprocessing;
using PIC = DocumentFormat.OpenXml.Drawing.Pictures;

namespace ExportadorDocumentos.Services.Word;

public class WordService : IDocumentGenerator
{
    private readonly string _templatesPath;
    private readonly ILogger<WordService> _logger;

    public WordService(IWebHostEnvironment env, ILogger<WordService> logger)
    {
        _logger = logger;
        _templatesPath = Path.Combine(env.ContentRootPath, "Templates");
    }

    public byte[] GenerarDesdeJson(string templateName, string? sheetName, Dictionary<string, JsonElement> datos)
    {
        string fullPath = Path.Combine(_templatesPath, templateName);
        if (!File.Exists(fullPath))
            throw new FileNotFoundException($"No se encontró la plantilla Word: {templateName}");

        var aplanados = JsonFlattener.Aplanar(datos);

        using var ms = new MemoryStream();
        using (var fs = new FileStream(fullPath, FileMode.Open, FileAccess.Read))
        {
            fs.CopyTo(ms);
        }
        ms.Position = 0;

        using (WordprocessingDocument wordDoc = WordprocessingDocument.Open(ms, true))
        {
            var allParagraphs = new List<Paragraph>();

            var body = wordDoc.MainDocumentPart?.Document?.Body;
            if (body != null)
                allParagraphs.AddRange(body.Descendants<Paragraph>());

            if (wordDoc.MainDocumentPart != null)
            {
                if (wordDoc.MainDocumentPart.HeaderParts != null)
                {
                    foreach (var headerPart in wordDoc.MainDocumentPart.HeaderParts)
                    {
                        if (headerPart.Header != null)
                            allParagraphs.AddRange(headerPart.Header.Descendants<Paragraph>());
                    }
                }

                if (wordDoc.MainDocumentPart.FooterParts != null)
                {
                    foreach (var footerPart in wordDoc.MainDocumentPart.FooterParts)
                    {
                        if (footerPart.Footer != null)
                            allParagraphs.AddRange(footerPart.Footer.Descendants<Paragraph>());
                    }
                }
            }

            foreach (var kvp in aplanados)
            {
                string searchKey = "{{" + kvp.Key + "}}";
                bool esImagen = kvp.Value.ValueKind == JsonValueKind.Object && ImageInjector.EsImagen(kvp.Value);
                string valorTxt = kvp.Value.ValueKind == JsonValueKind.Null ? "" : kvp.Value.ToString();

                foreach (var p in allParagraphs)
                {
                    if (esImagen)
                        InyectarFirmaWordEnParrafo(wordDoc, p, searchKey, kvp.Value);
                    else
                        ReemplazarTextoEnParrafo(p, searchKey, valorTxt);
                }
            }

            // Limpieza final de etiquetas sobrantes en el documento
            LimpiarEtiquetasSobrantes(allParagraphs);
        }

        return ms.ToArray();
    }

    private void ReemplazarTextoEnParrafo(Paragraph p, string searchKey, string replaceValue)
    {
        while (true)
        {
            var texts = p.Descendants<Text>().ToList();
            string fullText = string.Join("", texts.Select(t => t.Text));
            
            int startIndex = fullText.IndexOf(searchKey);
            if (startIndex == -1) break; 
            
            int currentIndex = 0;
            int matchLen = searchKey.Length;
            bool replacing = false;
            int charsToReplace = matchLen;
            
            foreach (var t in texts)
            {
                int tLen = t.Text.Length;
                if (!replacing)
                {
                    if (startIndex >= currentIndex && startIndex < currentIndex + tLen)
                    {
                        int startInT = startIndex - currentIndex;
                        replacing = true;
                        
                        if (startInT + charsToReplace <= tLen)
                        {
                            string before = t.Text.Substring(0, startInT);
                            string after = t.Text.Substring(startInT + charsToReplace);
                            t.Text = before + replaceValue + after;
                            t.Space = SpaceProcessingModeValues.Preserve;
                            charsToReplace = 0;
                            break;
                        }
                        else
                        {
                            string before = t.Text.Substring(0, startInT);
                            t.Text = before + replaceValue;
                            t.Space = SpaceProcessingModeValues.Preserve;
                            charsToReplace -= (tLen - startInT);
                        }
                    }
                }
                else
                {
                    if (charsToReplace >= tLen)
                    {
                        charsToReplace -= tLen;
                        t.Text = "";
                    }
                    else
                    {
                        t.Text = t.Text.Substring(charsToReplace);
                        charsToReplace = 0;
                        break;
                    }
                }
                currentIndex += tLen;
            }
        }
    }

    private void InyectarFirmaWordEnParrafo(WordprocessingDocument wordDoc, Paragraph p, string searchKey, JsonElement jsonImage)
    {
        while (true)
        {
            var texts = p.Descendants<Text>().ToList();
            string fullText = string.Join("", texts.Select(t => t.Text));
            
            int startIndex = fullText.IndexOf(searchKey);
            if (startIndex == -1) break; 
            
            int currentIndex = 0;
            int matchLen = searchKey.Length;
            bool replacing = false;
            int charsToReplace = matchLen;
            Text? nodeForImage = null;
            
            foreach (var t in texts)
            {
                int tLen = t.Text.Length;
                if (!replacing)
                {
                    if (startIndex >= currentIndex && startIndex < currentIndex + tLen)
                    {
                        int startInT = startIndex - currentIndex;
                        replacing = true;
                        nodeForImage = t;
                        
                        if (startInT + charsToReplace <= tLen)
                        {
                            string before = t.Text.Substring(0, startInT);
                            string after = t.Text.Substring(startInT + charsToReplace);
                            t.Text = before + after; 
                            charsToReplace = 0;
                            break;
                        }
                        else
                        {
                            string before = t.Text.Substring(0, startInT);
                            t.Text = before; 
                            charsToReplace -= (tLen - startInT);
                        }
                    }
                }
                else
                {
                    if (charsToReplace >= tLen)
                    {
                        charsToReplace -= tLen;
                        t.Text = "";
                    }
                    else
                    {
                        t.Text = t.Text.Substring(charsToReplace);
                        charsToReplace = 0;
                        break;
                    }
                }
                currentIndex += tLen;
            }

            if (nodeForImage != null)
            {
                string b64 = "";
                if (jsonImage.TryGetProperty("imageBase64", out var propB64)) 
                    b64 = propB64.GetString() ?? "";
                else if (jsonImage.TryGetProperty("firma_base64", out var propFirma))
                    b64 = propFirma.GetString() ?? "";

                if (!string.IsNullOrWhiteSpace(b64))
                {
                    if (b64.StartsWith("data:image"))
                        b64 = b64.Substring(b64.IndexOf(",") + 1);

                    byte[] imageBytes = Convert.FromBase64String(b64);
                    var targetPart = GetPartForElement(p, wordDoc);
                    if (targetPart != null)
                    {
                        ImagePart? imagePart = null;
                        if (targetPart is MainDocumentPart mainPart)
                            imagePart = mainPart.AddImagePart(ImagePartType.Png);
                        else if (targetPart is HeaderPart headerPart)
                            imagePart = headerPart.AddImagePart(ImagePartType.Png);
                        else if (targetPart is FooterPart footerPart)
                            imagePart = footerPart.AddImagePart(ImagePartType.Png);

                        if (imagePart != null)
                        {
                            using (var stream = new MemoryStream(imageBytes))
                            {
                                imagePart.FeedData(stream);
                            }
                            string relationshipId = targetPart.GetIdOfPart(imagePart);
                            var element = GenerarElementoImagen(relationshipId);
                            nodeForImage.InsertAfterSelf(element);
                        }
                    }
                }
            }
        }
    }

    private OpenXmlPart? GetPartForElement(OpenXmlElement element, WordprocessingDocument doc)
    {
        if (element.Ancestors<Header>().Any())
        {
            var header = element.Ancestors<Header>().First();
            return doc.MainDocumentPart?.HeaderParts.FirstOrDefault(x => x.Header == header) ?? (OpenXmlPart?)doc.MainDocumentPart;
        }
        if (element.Ancestors<Footer>().Any())
        {
            var footer = element.Ancestors<Footer>().First();
            return doc.MainDocumentPart?.FooterParts.FirstOrDefault(x => x.Footer == footer) ?? (OpenXmlPart?)doc.MainDocumentPart;
        }
        return doc.MainDocumentPart;
    }

    private Drawing GenerarElementoImagen(string relationshipId)
    {
        long widthEmus = 120L * 9525L;
        long heightEmus = 40L * 9525L;

        return new Drawing(
                 new DW.Inline(
                     new DW.Extent() { Cx = widthEmus, Cy = heightEmus },
                     new DW.EffectExtent() { LeftEdge = 0L, TopEdge = 0L, RightEdge = 0L, BottomEdge = 0L },
                     new DW.DocProperties() { Id = (UInt32Value)1U, Name = "Firma" },
                     new DW.NonVisualGraphicFrameDrawingProperties(
                         new A.GraphicFrameLocks() { NoChangeAspect = true }),
                     new A.Graphic(
                         new A.GraphicData(
                             new PIC.Picture(
                                 new PIC.NonVisualPictureProperties(
                                     new PIC.NonVisualDrawingProperties() { Id = (UInt32Value)0U, Name = "Firma.png" },
                                     new PIC.NonVisualPictureDrawingProperties()),
                                 new PIC.BlipFill(
                                     new A.Blip(
                                         new A.BlipExtensionList(
                                             new A.BlipExtension() { Uri = "{28A0092B-C50C-407E-A947-70E740481C1C}" })
                                     )
                                     { Embed = relationshipId, CompressionState = A.BlipCompressionValues.Print },
                                     new A.Stretch(
                                         new A.FillRectangle())),
                                 new PIC.ShapeProperties(
                                     new A.Transform2D(
                                         new A.Offset() { X = 0L, Y = 0L },
                                         new A.Extents() { Cx = widthEmus, Cy = heightEmus }),
                                     new A.PresetGeometry(
                                         new A.AdjustValueList()
                                     )
                                     { Preset = A.ShapeTypeValues.Rectangle }))
                         )
                         { Uri = "http://schemas.openxmlformats.org/drawingml/2006/picture" })
                 )
                 { DistanceFromTop = (UInt32Value)0U, DistanceFromBottom = (UInt32Value)0U, DistanceFromLeft = (UInt32Value)0U, DistanceFromRight = (UInt32Value)0U, EditId = "50D07946" });
    }

    private void LimpiarEtiquetasSobrantes(List<Paragraph> paragraphs)
    {
        var regex = new Regex(@"\{\{.*?\}\}");
        foreach (var p in paragraphs)
        {
            var texts = p.Descendants<Text>().ToList();
            if (!texts.Any()) continue;

            string fullText = string.Join("", texts.Select(t => t.Text));
            if (regex.IsMatch(fullText))
            {
                string cleanText = regex.Replace(fullText, "");
                
                texts[0].Text = cleanText;
                texts[0].Space = SpaceProcessingModeValues.Preserve;
                for (int i = 1; i < texts.Count; i++)
                {
                    texts[i].Text = "";
                }
            }
        }
    }
}
