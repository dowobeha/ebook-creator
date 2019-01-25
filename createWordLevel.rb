#!/usr/bin/ruby

require 'fileutils'
require 'securerandom'
require 'time'

if ARGV.length != 8
	STDERR.puts "Usage:\t#{$0} data.tsv metadata.tsv imageDir fontDir cssDir jsDir audioDir outputDir"
	exit(-1)
end

class Clip

	attr_reader :number, :text, :startTime, :endTime, :audioFile

	def initialize(number, text, startTime, endTime, audioFile)
		@number    = number
		@text      = text
		@startTime = startTime
		@endTime   = endTime
		@audioFile = audioFile
	end

	def duration()
		durationInSeconds = Time.parse(endTime) - Time.parse(startTime)
		return Time.at(durationInSeconds).utc.strftime("%H:%M:%S.%L")
	end


end

class Segment

	attr_reader :number, :clips

	def initialize(number)
		@number = number
		@clips = Array.new
	end

end

class Page

    attr_reader :number, :zero_padded_number, :segments

	def initialize(number)
		@number    = number
        @zero_padded_number = number.to_s.rjust(4, "0")
		@segments  = Array.new
	end

	def duration()
	
		startTime = @segments.first.clips.first.startTime
		endTime   = @segments.last.clips.last.endTime
	
	    durationInSeconds = Time.parse(endTime) - Time.parse(startTime)
		return Time.at(durationInSeconds).utc.strftime("%H:%M:%S.%L")
	end

end

class MetaDataElement

	def initialize(tag, properties, value)
		@tag        = tag
		if properties==nil or properties.empty?
			@properties = ""
		else
			@properties = properties
		end
		@value      = value
	end

	def to_s()
		if @properties.empty?
		   return "<#{@tag}>#{@value}</#{@tag}>"
		else
		   return "<#{@tag} #{@properties}>#{@value}</#{@tag}>"
		end
	end

end


# Read data from data.tsv
pages=Array.new
clipNumber=0
File.open(ARGV[0]).each_line {|line|
	(pageNumber, text, segmentNumber, startTime, endTime, audioFile)=line.strip.split("\t")
	
	# Create new page if required
	if pages.empty? or pageNumber!=pages.last.number
		page = Page.new(pageNumber)
		pages.push(page)
		STDERR.puts("New page:\t#{pageNumber}")
	end
	
	# Create new segment if required
	if pages.last.segments.empty? or segmentNumber!=pages.last.segments.last.number
		segment = Segment.new(segmentNumber)
		pages.last.segments.push(segment)
		STDERR.puts("New segment:\t#{segmentNumber} on page #{pageNumber}")
	end
	
	# At this point, the current clip is guaranteed to be part of the last segment of the last page
	pages.last.segments.last.clips.push(Clip.new(clipNumber.to_s.rjust(4, "0"), text, startTime, endTime, audioFile))
	STDERR.puts("New clip:\t#{clipNumber} in segment #{segmentNumber} on page #{pageNumber}")
	clipNumber += 1	
}

# Read metadata from metadata.tsv
title=""
metadata=Array.new
File.open(ARGV[1]).each_line {|line|
	(tag, properties, value)=line.strip.split("\t")
	metadata.push(MetaDataElement.new(tag, properties, value))
	if tag=="dc:title"
		title=value
	end
	
}
if title==""
	System.err.puts("Error:\tTitle must be defined in the metadata file")
	exit(-2)
end

# Read font filenames
font_filenames=Array.new
Dir.chdir(ARGV[3]) do
	Dir.glob("*.ttf").each{|font_file|
    	font_filenames.push(font_file)
	}
end

# Read CSS filenames
css_filenames=Array.new
Dir.chdir(ARGV[4]) do
	Dir.glob("*.css").each{|css_file|
    	css_filenames.push(css_file)
	}
end

# Read Javascript filenames
javascript_filenames=Array.new
Dir.chdir(ARGV[5]) do
	Dir.glob("*.js").each{|javascript_file|
    	javascript_filenames.push(javascript_file)
	}
end

# Read audio filenames
audio_filenames=Array.new
Dir.chdir(ARGV[6]) do
	Dir.glob("*.m4a").each{|audio_file|
    	audio_filenames.push(audio_file)
	}
end

# Delete outputDir if it already exists
outputDir=ARGV[7]
if File.directory?(outputDir)
	FileUtils.remove_dir(outputDir)
end

# Delete outputDir.epub if it already exists
epub=File.absolute_path(ARGV[7]+".epub")
if File.exists?(epub)
	FileUtils.rm(epub)
end



# Create outputDir (and its parents, if necessary)
FileUtils.mkdir_p(outputDir+File::SEPARATOR+"META-INF")
FileUtils.mkdir_p(outputDir+File::SEPARATOR+"OEBPS")
FileUtils.mkdir_p(outputDir+File::SEPARATOR+"OEBPS"+File::SEPARATOR+"smil")

# Copy files
FileUtils.cp_r(ARGV[2], outputDir+File::SEPARATOR+"OEBPS"+File::SEPARATOR+"images")
FileUtils.cp_r(ARGV[3], outputDir+File::SEPARATOR+"OEBPS"+File::SEPARATOR+"fonts")
FileUtils.cp_r(ARGV[4], outputDir+File::SEPARATOR+"OEBPS"+File::SEPARATOR+"css")
FileUtils.cp_r(ARGV[5], outputDir+File::SEPARATOR+"OEBPS"+File::SEPARATOR+"js")
FileUtils.cp_r(ARGV[6], outputDir+File::SEPARATOR+"OEBPS"+File::SEPARATOR+"media")

# Create random UUID
uuid=SecureRandom.uuid()

File.open(outputDir+File::SEPARATOR+"OEBPS"+File::SEPARATOR+"content.opf", 'w') { |content_opf| 

    header = <<END
<?xml version="1.0" encoding="utf-8"?>
<package xmlns="http://www.idpf.org/2007/opf" unique-identifier="book-id" version="3.0" prefix="rendition: http://www.idpf.org/vocab/rendition/# ibooks: http://vocabulary.itunes.apple.com/rdf/ibooks/vocabulary-extensions-1.0/">

	<metadata xmlns="http://www.idpf.org/2007/opf" xmlns:dc="http://purl.org/dc/elements/1.1/" >

		<!-- EPUB3 SPECIFICATIONS -->
		<meta property="rendition:layout">pre-paginated</meta>
		<meta property="rendition:spread">auto</meta>
		<meta property="rendition:orientation">auto</meta>
		
		<!-- IBOOKS SPECIFICATIONS -->
		<meta property="ibooks:version">1.0</meta>	
		<meta property="ibooks:specified-fonts">true</meta>
		<meta property="ibooks:binding">true</meta>

END

	footer="</package>"

    uuidHeader = "<dc:identifier id=\"book-id\">urn:uuid:"

    uuidFooter="</dc:identifier>"

	content_opf.puts(header)
	
	content_opf.puts("\t\t<!-- Automatically generated UUID -->")
	content_opf.puts("\t\t"+uuidHeader+uuid+uuidFooter)
	content_opf.puts()
		
	content_opf.puts("\t\t<!-- COVER -->")
#	content_opf.puts("\t\t<meta name=\"cover\" content=\"imagePage#{pages[0].number}\" />	<!-- REQUIRED -->")
	content_opf.puts("\t\t<meta name=\"cover\" content=\"coverImage\" />	<!-- REQUIRED -->")
	content_opf.puts()

	content_opf.puts("\t\t<!-- Media duration of each page -->")
	pages.each{|page|
		content_opf.puts("\t\t<meta property=\"media:duration\" refines=\"#mediaOverlayPage#{page.number}\">#{page.duration}</meta>")
	}
	content_opf.puts()
	
	content_opf.puts("\t\t<!-- Last modified -->")
	content_opf.puts("\t\t<meta property=\"dcterms:modified\">#{Time.now.strftime("%FT%TZ")}</meta>	 <!-- REQUIRED -->")
	content_opf.puts()
	
	content_opf.puts("\t\t<!-- User-provided metadata -->")
	metadata.each{|element| 
	    content_opf.puts("\t\t"+element.to_s)
	}
	content_opf.puts()

	content_opf.puts("\t</metadata>")
	content_opf.puts()
	
	content_opf.puts()
	content_opf.puts("\t<manifest>")
	content_opf.puts()
	
	content_opf.puts("\t\t<!-- nav -->")
	content_opf.puts("\t\t<item id=\"toc\" href=\"toc.xhtml\" media-type=\"application/xhtml+xml\" properties=\"nav\" />")
	content_opf.puts()
	
	content_opf.puts("\t\t<!-- css -->")
	css_filenames.each{|css_filename|
		content_opf.puts("\t\t<item id=\"css-a\" href=\"css/#{css_filename}\" media-type=\"text/css\" />")
	}
	content_opf.puts()
	
	content_opf.puts("\t\t<!-- javascript -->")
	javascript_filenames.each{|javascript_filename|
		content_opf.puts("\t\t<item id=\"js-ib\" href=\"js/#{javascript_filename}\" media-type=\"text/javascript\" />")
	}
	content_opf.puts()
	
    content_opf.puts("\t\t<!-- fonts -->")
	font_filenames.each{|font_filename|
		content_opf.puts("\t\t<item id=\"#{font_filename.chomp(".ttf")}\" href=\"fonts/#{font_filename}\" media-type=\"application/x-font-ttf\" />")
	}
	content_opf.puts()

    content_opf.puts("\t\t<!-- audio -->")
	audio_filenames.each{|audio_filename|
		content_opf.puts("\t\t<item id=\"#{audio_filename.chomp(".m4a")}\" href=\"media/#{audio_filename}\" media-type=\"audio/mpeg\" />")
	}
	content_opf.puts()

	content_opf.puts("\t\t<!-- Cover image -->")
	content_opf.puts("\t\t<item id=\"coverImage\" href=\"images/cover.png\" media-type=\"image/png\" properties=\"cover-image\" />")
	content_opf.puts()
	
	pages.each{|page|
		content_opf.puts("\t\t<!-- Page #{page.number} -->")
		content_opf.puts("\t\t<item id=\"mediaOverlayPage#{page.number}\" href=\"smil/#{page.number}.smil\" media-type=\"application/smil+xml\" />")
		content_opf.puts("\t\t<item id=\"page#{page.number}\" media-type=\"application/xhtml+xml\" href=\"#{page.number}.xhtml\" media-overlay=\"mediaOverlayPage#{page.number}\" />")
#		content_opf.puts("\t\t<item id=\"imagePage#{page.number}\" href=\"images/#{page.number}.png\" media-type=\"image/png\"#{page.number==0 ? " properties=\"cover-image\" " : " "}/>")
		content_opf.puts("\t\t<item id=\"imagePage#{page.number}\" href=\"images/#{page.zero_padded_number}.png\" media-type=\"image/png\" />")
		content_opf.puts()
	}
	
	content_opf.puts("\t</manifest>")
	content_opf.puts()

	content_opf.puts()
	content_opf.puts("\t<spine>	<!-- Defines the order of the pages -->")
	pages.each{|page|
		content_opf.puts("\t\t<itemref idref=\"page#{page.number}\"#{page.number==pages.first.number ? " linear=\"no\" " : " "}/>") #  #{page.number==pages.last.number ? "linear=\"no\" " : ""}
	}
	content_opf.puts("\t</spine>")	
	
	content_opf.puts(footer) 
	
}



pages.each{|page|

	File.open(outputDir+File::SEPARATOR+"OEBPS"+File::SEPARATOR+"#{page.number}.xhtml", 'w') { |xhtml|
		xhtml.puts("<?xml version=\"1.0\" encoding=\"UTF-8\"?>")
		xhtml.puts("<html xmlns=\"http://www.w3.org/1999/xhtml\" xmlns:epub=\"http://www.idpf.org/2007/ops\" xml:lang=\"en\">")
		xhtml.puts()
		xhtml.puts("\t<head>")
		xhtml.puts("\t\t<meta name=\"viewport\" content=\"width=738, height=985\" />")
		xhtml.puts("\t\t<meta charset=\"UTF-8\" />")
		xhtml.puts("\t\t<title>#{title}</title>")
		css_filenames.each{|css_filename|
			xhtml.puts("\t\t<link href=\"css/#{css_filename}\" type=\"text/css\" rel=\"stylesheet\"/>")
		}
		xhtml.puts("\t</head>")
		xhtml.puts()
		xhtml.puts("\t<body style=\"background-color: #ffffff; margin: 0;\">")
		xhtml.puts("\t\t<div class=\"outer\" id=\"#{page.number}Outer\" >")
		page.segments.each_with_index{|segment,index|
			if index==0 then
				xhtml.print("\t\t\t<h1 class=\"text\" id=\"segment#{segment.number}\">")
			else 
				xhtml.print("\t\t\t<p class=\"plaintext\" id=\"segment#{segment.number}\">")
			end
			segment.clips.each{|clip|
				xhtml.print("\t\t\t<span id=\"#{clip.number}\">#{clip.text.gsub(" ", '&#160;')}</span>")
			}
			if index==0 then
				xhtml.puts("\t\t\t</h1>")
				xhtml.puts("\t\t\t<div class=\"#{page.number==pages.first.number ? "flexHeightIllustrationRegion" : "illustrationRegion"}\">")
		        xhtml.puts("\t\t\t\t<img class=\"#{page.number==pages.first.number ? "flexHeightIllustration" : "illustration"}\" src=\"images/#{page.zero_padded_number}.png\" />")
        		xhtml.puts("\t\t\t</div>")
			else 
				xhtml.puts("\t\t\t</p>")
			end
		}
		xhtml.puts("\t\t</div>")
#        xhtml.puts("\t\t\t<h1 class=\"text\" id=\"#{page.clip}\">#{page.text}</h1>")

# 		xhtml.puts("<form action=\"/action_page.php\">")
# 		xhtml.puts("<select name=\"cars\">")
# 		xhtml.puts("  <option value=\"volvo\">Volvo</option>")
# 		xhtml.puts("  <option value=\"saab\">Saab</option>")
# 		xhtml.puts("  <option value=\"fiat\">Fiat</option>")
# 		xhtml.puts("  <option value=\"audi\">Audi</option>")
# 		xhtml.puts("</select>")
# 		xhtml.puts("<br />")
# 		xhtml.puts("</form>")
# 		xhtml.puts("\t\t<script>")
# 		xhtml.puts("document.body.style.backgroundColor = \"#AA0000\";")
# 		xhtml.puts("x = document.getElementById('#{page.clip}');")
# 		xhtml.puts("function hasGetUserMedia() {")
# 		xhtml.puts("  return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||")
# 		xhtml.puts("            navigator.mozGetUserMedia || navigator.msGetUserMedia);")
# 		xhtml.puts("}")
# 		xhtml.puts()
# 		xhtml.puts("if (hasGetUserMedia()) {")
# 		xhtml.puts("x.style.backgroundColor = \"#00AA00\";")
# 		xhtml.puts("} else {")
# 		xhtml.puts("x.style.backgroundColor = \"#0000AA\";")
# 		xhtml.puts("}")
# 		xhtml.puts("</script>")
		xhtml.puts("\t<span xml:id=\"page#{page.number}\" epub:type=\"pagebreak\">#{page.number.to_i}</span>")
		xhtml.puts("\t</body>")
		xhtml.puts()
		xhtml.puts("</html>")

	}


	File.open(outputDir+File::SEPARATOR+"OEBPS"+File::SEPARATOR+"smil"+File::SEPARATOR+"#{page.number}.smil", 'w') { |smil|
		smil.puts("<?xml version=\"1.0\" encoding=\"utf-8\"?>")
		smil.puts("<smil xmlns=\"http://www.w3.org/ns/SMIL\" version=\"3.0\">")
		smil.puts()
	  	smil.puts("\t<body>")
		smil.puts()
		page.segments.each{|segment|
			smil.puts("\t\t<seq>")
			segment.clips.each{|clip|
				smil.puts("\t\t\t<par id=\"id#{clip.number}\">")
				smil.puts("\t\t\t\t<text src=\"../#{page.number}.xhtml##{clip.number}\"/>")
				smil.puts("\t\t\t\t<audio clipBegin=\"#{clip.startTime}\" clipEnd=\"#{clip.endTime}\" src=\"../media/#{clip.audioFile}\"/>")
				smil.puts("\t\t\t</par>")	
			}
			smil.puts("\t\t</seq>")
		}
		smil.puts()
  		smil.puts("\t</body>")
		smil.puts()
		smil.puts("</smil>")

	}


}

File.open(outputDir+File::SEPARATOR+"OEBPS"+File::SEPARATOR+"toc.xhtml", 'w') { |toc| 
	toc.puts("<?xml version=\"1.0\" encoding=\"utf-8\"?>")
	toc.puts("<html xmlns=\"http://www.w3.org/1999/xhtml\" xmlns:epub=\"http://www.idpf.org/2007/ops\"")
    toc.puts("      xmlns:ibooks=\"http://vocabulary.itunes.apple.com/rdf/ibooks/vocabulary-extensions-1.0\" ")
    toc.puts("      epub:prefix=\"ibooks: http://vocabulary.itunes.apple.com/rdf/ibooks/vocabulary-extensions-1.0\">")
    toc.puts()
    toc.puts("\t<head>")
    toc.puts("\t<meta charset=\"UTF-8\"/>")
    toc.puts("\t<meta name=\"viewport\" content=\"width=738, height=985\" />")
    toc.puts("\t</head>")
    toc.puts()
    toc.puts("\t<body>")
    toc.puts()
    toc.puts("\t\t<nav epub:type=\"toc\">")
    toc.puts()
    toc.puts("\t\t\t<h1 id=\"toc-header\" class=\"center\">Table of Contents</h1>  <!-- only used for page display -->")
    toc.puts("\t\t\t<ol>")
    toc.puts("\t\t\t\t\t<li><a epub:type=\"title-page\" href=\"#{pages.first.number}.xhtml\">Title page</a></li>")
    toc.puts("\t\t\t\t\t<li><a epub:type=\"bodymatter\" href=\"0001.xhtml\">Start of Content</a></li>")
	toc.puts("\t\t\t</ol>")
    toc.puts("\t\t</nav>")
    toc.puts()
    toc.puts("\t\t<nav epub:type=\"landmarks\">")
#   toc.puts("\t\t\t<div class=\"hidden\"> 	<!-- used to hide this section in the TOC page display -->")
    toc.puts("\t\t\t<div>")
    toc.puts("\t\t\t\t<ol>")
    toc.puts("\t\t\t\t\t<li><a epub:type=\"title-page\" href=\"#{pages.first.number}.xhtml\">Title</a></li>")
    toc.puts("\t\t\t\t\t<li><a epub:type=\"cover\" href=\"0000.xhtml\">Cover</a></li>")
    toc.puts("\t\t\t\t\t<li><a epub:type=\"ibooks:reader-start-page\" href=\"0000.xhtml\">Start Reading</a></li>")
    toc.puts("\t\t\t\t\t<li><a epub:type=\"bodymatter\" href=\"0000.xhtml\">Start of Content</a></li>")
    toc.puts("\t\t\t\t</ol>")
    toc.puts("\t\t\t</div>")
    toc.puts("\t\t</nav>")
    toc.puts()
    toc.puts("\t\t<nav epub:type=\"page-list\"> 	<!-- this section creates custom page numbering -->")
#    toc.puts("\t\t\t<ol class=\"hidden\">")
    pages.each{|page|
    	toc.puts("\t\t\t\t<li><a href=\"#{page.number}.xhtml\">#{page.number.to_i}</a></li>")
    }
    toc.puts("\t\t\t</ol>")
    toc.puts("\t\t</nav>")
    toc.puts()
    toc.puts("\t</body>")
    toc.puts("</html>")
}

File.open(outputDir+File::SEPARATOR+"mimetype", 'w') { |mimetype|

	mimetype.print("application/epub+zip")

}

File.open(outputDir+File::SEPARATOR+"META-INF"+File::SEPARATOR+"container.xml", 'w') { |container|

	container.puts("<?xml version=\"1.0\"?>")
	container.puts("<container version=\"1.0\" xmlns=\"urn:oasis:names:tc:opendocument:xmlns:container\">")
    container.puts("\t<rootfiles>")
    container.puts("\t\t<rootfile full-path=\"OEBPS/content.opf\" media-type=\"application/oebps-package+xml\"/>")
	container.puts("\t</rootfiles>")
	container.puts("</container>")

}

Dir.chdir(outputDir) do
    system("zip -X #{epub} mimetype")
    puts $?
	system("zip -rg #{epub} META-INF -x \*.DS_Store")
	puts $?
	system("zip -rg #{epub} OEBPS -x \*.DS_Store")
	puts $?
end
