function spellcheck(graphemes, vowels, entry) {

    var alphabet = new Set(['ngngw', 'ghhw', 'ngng', 'ghh', 'ghw', 'ngw', 'gg', 'gh', 'kw', 'll', 'mm', 'ng', 'nn', 'qw', 'rr', 'wh', 'a', 'e', 'f', 'g', 'h', 'i', 'k', 'l', 'm', 'n', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'y', 'z'])

    var punctuation = new Set(["'", '\u2019', '.', ',', '!', '?', ';', ':', '\u2500'])

    var c_v = []

    for (var i = 0; i < graphemes.length; i++) {
        var grapheme = graphemes[i]
        // Check for illegal alphabetic characters
        if (!alphabet.has(grapheme) && !punctuation.has(grapheme) && isNaN(grapheme)) {
            return false
        }
        // Converts legal characters to consonant "c" or vowel "v"
        if (vowels.has(grapheme) && isNaN(grapheme)) {
            c_v.push("v")
        } else if (punctuation.has(grapheme) || !isNaN(grapheme)) {
            c_v.push(grapheme)
        } else {
            c_v.push("c")
        }
    }

    // Checks for illegal apostrophe, consonant, and vowel clusters
    var str = entry
    var cv  = c_v.join("")
    var apostrophe = /'/g

    var consecutiveApostrophes = /''+/
    var consonantCluster = /ccc+/
	var CClusterInOnset = /\bcc+/g
    var vowelCluster = /iii+|aaa+|uuu+|ee+|ia+|iu+|ie+|ai+|au+|ae+|ui+|ua+|ue+|ei+|ea+|eu+/

    if (apostrophe.test(str)) {
        if (consecutiveApostrophes.test(str)) {
            return false
        } else {
            substr = str.split("'")
            subcv  = cv.split("'")

            if (vowelCluster.test(substr.join("")) || consonantCluster.test(subcv.join(""))) {
                return false
            }
        }
    } else if (vowelCluster.test(str) || consonantCluster.test(cv)) {
        return false
    } else if (CClusterInOnset.test(cv)) {
		return false
	}

    return true
}


function isAlpha(character) {
    if (character.toLowerCase() != character.toUpperCase()) {
        return true
    } else {
        return false
    }
}


function tokenize(word, keep_punctuation) {
    if (keep_punctuation === undefined) {
        keep_punctuation = false
    }

    var graphemes = ['Ngngw', 'ngngw', 'Ghhw', 'ghhw', 'Ngng', 'ngng', 'Ghh', 'ghh', 'Ghw', 'ghw', 'Ngw', 'ngw', 'Gg', 'gg', 'Gh', 'gh', 'Kw', 'kw', 'Ll', 'll', 'Mm', 'mm', 'Ng', 'ng', 'Nn', 'nn', 'Qw', 'qw', 'Rr', 'rr', 'Wh', 'wh', 'A', 'a', 'E', 'e', 'F', 'f', 'G', 'g', 'H', 'h', 'I', 'i', 'K', 'k', 'L', 'l', 'M', 'm', 'N', 'n', 'P', 'p', 'Q', 'q', 'R', 'r', 'S', 's', 'T', 't', 'U', 'u', 'V', 'v', 'W', 'w', 'Y', 'y', 'Z', 'z']

    var punctuation = new Set(["'", '\u2019', '.', ',', '!', '?', ';', ':', '\u2500'])

    var result = []

    var end = word.length

    while (end > 0) {
        var found_grapheme = false
		
        for (var i = 0; i < graphemes.length; i++) {
            var grapheme = graphemes[i]
			
            if (word.slice(0, end).endsWith(grapheme)) {
			
                result.unshift(grapheme)
                end -= grapheme.length
                found_grapheme = true
                break
            }
        }
		
        if (! found_grapheme) {
            var character = word.substring(end-1, end)
			
                if (isAlpha(character)) {
                    result.unshift(character)
                } else if (keep_punctuation && punctuation.has(character) || !isNaN(character)) {
                    result.unshift(character)
                } 

                end -= 1
        }
    } // End 'while' Loop

    return result
}


function tokens_to_string(tokens) {
    var s=""
    for (var i=0; i<tokens.length; i++) {
        s += tokens[i]
        //s += " "
    }
	
    return s
}


function tokenize_to_string(word) {
    var tokens = graphemes2phonemes_nagai2001(redouble(tokenize(word.toLowerCase(), false)))
	
    var s=""
    for (var i=0; i<tokens.length; i++) {
        s += tokens[i]
        s += " "
    }
	
    return s
}


// Undoes the Latin orthographic undoubling rules, i.e. redoubles the graphemes that are underlyingly voiceless
function redouble(graphemes, color) {

    var doubled_fricative    =new Set(['ll', 'rr', 'gg', 'ghh', 'ghhw'])

    var doubleable_fricative =new Set(['l', 'r', 'g', 'gh', 'ghw'])
    var doubleable_nasal     =new Set(['n', 'm', 'ng', 'ngw'])

    var undoubleable_unvoiced_consonant = new Set(['p', 't', 'k', 'kw', 'q', 'qw', 'f', 's', 'wh'])

    var double={'l'  : 'll',
                'r'  : 'rr',
                'g'  : 'gg',
                'gh' : 'ghh',
                'ghw': 'ghhw',
                'n'  : 'nn',
                'm'  : 'mm',
                'ng' : 'ngng',
                'ngw': 'ngngw'}

    var result = graphemes.slice(0) // Copy the list of graphemes

    var i = 0

    while (i+1 < result.length) {
        var first = result[i]
        var second = result[i+1]
	
        // Rule 1a                                                                                                                        
        if (doubleable_fricative.has(first) && undoubleable_unvoiced_consonant.has(second)) {
            if (color) {
                result[i] = double[first].fontcolor("#810081")
            } else {
                result[i] = double[first]
            }
            i += 2
        }
        // Rule 1b                                                                                                                        
        else if (undoubleable_unvoiced_consonant.has(first) && doubleable_fricative.has(second)) {
            if (color) {
            result[i+1] = double[second].fontcolor("#810081")
            } else {
                result[i+1] = double[second]
            }
            i += 2
        }
        // Rule 2                                                                                                                         
        else if (undoubleable_unvoiced_consonant.has(first) && doubleable_nasal.has(second)) {
            if (color) {
                result[i+1] = double[second].fontcolor("#810081")
            } else {
                result[i+1] = double[second]
            }
            i += 2
        }
        // Rule 3a                                                                                                                        
        else if (doubled_fricative.has(first) && (doubleable_fricative.has(second) || doubleable_nasal.has(second))) {
            if (color) {
                result[i+1] = double[second].fontcolor("#810081")
            } else {
                result[i+1] = double[second]
            }
            i += 2
        }
        // Rule 3b                                                                                                                        
        else if ((doubleable_fricative.has(first) || doubleable_nasal.has(first)) && second=='ll') {
            if (color) {
                result[i] = double[first].fontcolor("#810081")
            } else {
                result[i] = double[first]
            }
            i += 2
        } 
        else {
            i += 1	
        }
    } // End 'while' Loop
	
    return result
}


function graphemes_to_phonemes_ipa(graphemes) {

    var ipa = {
        // Vowels                                                                                                                     
        "i":"\u0069",                // LATIN SMALL LETTER I
        "a":"\u0251",                // LATIN SMALL LETTER ALPHA
        "u":"\u0075",                // LATIN SMALL LETTER U
        "e":"\u0259",                // LATIN SMALL LETTER SCHWA

        // Stops                                                                                                                      
        "p" :"\u0070",               // LATIN SMALL LETTER P
        "t" :"\u0074",               // LATIN SMALL LETTER T
        "k" :"\u006B",               // LATIN SMALL LETTER K
        "kw":"\u006B\u02B7",         // LATIN SMALL LETTER K                           with MODIFIER LETTER SMALL W
        "q" :"\u0071",               // LATIN SMALL LETTER Q
        "qw":"\u0071\u02B7",         // LATIN SMALL LETTER Q                           with MODIFIER LETTER SMALL W

        // Voiced fricatives                                                                                                          
        "v"  :"\u0076",              // LATIN SMALL LETTER V
        "l"  :"\u006C",              // LATIN SMALL LETTER L
        "z"  :"\u007A",              // LATIN SMALL LETTER Z
        "y"  :"\u006A",              // LATIN SMALL LETTER J
        "r"  :"\u027B",              // LATIN SMALL LETTER TURNED R WITH HOOK
        "g"  :"\u0263",              // LATIN SMALL LETTER GAMMA
        "w"  :"\u0263\u02B7",        // LATIN SMALL LETTER GAMMA                       with MODIFIER LETTER SMALL W
        "gh" :"\u0281",              // LATIN LATTER SMALL CAPITAL INVERTED R
        "ghw":"\u0281\u02B7",        // LATIN LATTER SMALL CAPITAL INVERTED R          with MODIFIER LETTER SMALL W

        // Voiceless fricatives                                                                                                       
        "f"   :"\u0066",             // LATIN SMALL LETTER F
        "ll"  :"\u026C",             // LATIN SMALL LETTER L WITH BELT
        "s"   :"\u0073",             // LATIN SMALL LETTER S
        "rr"  :"\u0282",             // LATIN SMALL LETTER S WITH HOOK
        "gg"  :"\u0078",             // LATIN SMALL LETTER X
        "wh"  :"\u0078\u02B7",       // LATIN SMALL LETTER X                           with MODIFIER LETTER SMALL W
        "ghh" :"\u03C7",             // GREEK SMALL LETTER CHI
        "ghhw":"\u03C7\u02B7",       // GREEK SMALL LETTER CHI                         with MODIFIER LETTER SMALL W
        "h"   :"\u0068",             // LATIN SMALL LETTER H

        // Voiced nasals                                                                                                              
        "m"  :"\u006D",              // LATIN SMALL LETTER M
        "n"  :"\u006E",              // LATIN SMALL LETTER N
        "ng" :"\u014B",              // LATIN SMALL LETTER ENG
        "ngw":"\u014B\u02B7",        // LATIN SMALL LETTER ENG                          with MODIFIER LETTER SMALL W

        // Voiceless nasals                                                                                                           
        "mm":"\u006D\u0325",          // LATIN SMALL LETTER M   with COMBINING RING BELOW
        "nn":"\u006E\u0325",          // LATIN SMALL LETTER N   with COMBINING RING BELOW
        "ngng":"\u014B\u030A",        // LATIN SMALL LETTER ENG with COMBINING RING ABOVE
        "ngngw":"\u014B\u030A\u02B7", // LATIN SMALL LETTER ENG with COMBINING RING ABOVE and MODIFIER LETTER SMALL W
    }

    var result = []

    for (var i=0; i<graphemes.length; i++) {
        var grapheme = graphemes[i]
		
        if (grapheme in ipa) {
            result.push(ipa[grapheme])
        } else if (isAlpha(grapheme)) {
            result.push(grapheme)
        }
    }
	
    return result
}


function graphemes_to_phonemes_krauss1975(graphemes) {

    var krauss1975 = {
        // Vowels                                                                                                                     
        "i":"\u0069",                // LATIN SMALL LETTER I
        "a":"\u0061",                // LATIN SMALL LETTER A
        "u":"\u0075",                // LATIN SMALL LETTER U
        "e":"\u0259",                // LATIN SMALL LETTER SCHWA

        // Stops                                                                                                                      
        "p" :"\u0070",               // LATIN SMALL LETTER P
        "t" :"\u0074",               // LATIN SMALL LETTER T
        "k" :"\u006B",               // LATIN SMALL LETTER K
        "kw":"\u006B\u02B7",         // LATIN SMALL LETTER K                             with MODIFIER LETTER SMALL W
        "q" :"\u0071",               // LATIN SMALL LETTER Q
        "qw":"\u0071\u02B7",         // LATIN SMALL LETTER Q                             with MODIFIER LETTER SMALL W

        // Voiced fricatives                                                                                                          
        "v"  :"\u0076",              // LATIN SMALL LETTER V
        "l"  :"\u006C",              // LATIN SMALL LETTER L
        "z"  :"\u007A",              // LATIN SMALL LETTER Z
        "y"  :"\u0079",              // LATIN SMALL LETTER Y
        "r"  :"\u0072",              // LATIN SMALL LETTER R
        "g"  :"\u0263",              // LATIN SMALL LETTER GAMMA
        "w"  :"\u0263\u02B7",        // LATIN SMALL LETTER GAMMA                         with MODIFIER LETTER SMALL W
        "gh" :"\u0263\u0323",        // LATIN SMALL LETTER GAMMA with COMBINING DOT BELOW
        "ghw":"\u0263\u0323\u02B7",  // LATIN SMALL LETTER GAMMA with COMBINING DOT BELOW and MODIFIER LETTER SMALL W

        // Voiceless fricatives                                                                                                       
        "f"   :"\u0066",             // LATIN SMALL LETTER F
        "ll"  :"\u026C",             // LATIN SMALL LETTER L WITH BELT
         "s"   :"\u0073",             // LATIN SMALL LETTER S
        "rr"  :"\u0072\u0325",       // LATIN SMALL LETTER R   with COMBINING RING BELOW
        "gg"  :"\u0078",             // LATIN SMALL LETTER X
        "wh"  :"\u0078\u02B7",       // LATIN SMALL LETTER X                             with MODIFIER LETTER SMALL W
        "ghh" :"\u0078\u0323",       // LATIN SMALL LETTER X   with COMBINING DOT BELOW
        "ghhw":"\u0078\u0323\u02B7", // LATIN SMALL LETTER X   with COMBINING DOT BELOW   and MODIFIER LETTER SMALL W
        "h"   :"\u0068",             // LATIN SMALL LETTER H

        // Voiced nasals                                                                                                              
        "m"  :"\u006D",              // LATIN SMALL LETTER M
        "n"  :"\u006E",              // LATIN SMALL LETTER N
        "ng" :"\u014B",              // LATIN SMALL LETTER ENG
        "ngw":"\u014B\u02B7",        // LATIN SMALL LETTER ENG                          with MODIFIER LETTER SMALL W

        // Voiceless nasals                                                                                                           
        "mm":"\u006D\u0325",          // LATIN SMALL LETTER M   with COMBINING RING BELOW
        "nn":"\u006E\u0325",          // LATIN SMALL LETTER N   with COMBINING RING BELOW
        "ngng":"\u014B\u0325",        // LATIN SMALL LETTER ENG with COMBINING RING BELOW
        "ngngw":"\u014B\u0325\u02B7", // LATIN SMALL LETTER ENG with COMBINING RING BELOW and MODIFIER LETTER SMALL W
    }

    var result = []

    for (var i=0; i<graphemes.length; i++) {
        var grapheme = graphemes[i]
		
        if (grapheme in krauss1975) {
            result.push(krauss1975[grapheme])
        } else if (isAlpha(grapheme)) {
            result.push(grapheme)
        }
    }
	
    return result
}


function graphemes_to_phonemes_nagai2001(graphemes) {

    var nagai2001 = {
        // Vowels                                                                                                                     
        "i":"\u0069",                // LATIN SMALL LETTER I
        "a":"\u0061",                // LATIN SMALL LETTER A
        "u":"\u0075",                // LATIN SMALL LETTER U
        "e":"\u0259",                // LATIN SMALL LETTER SCHWA

        // Stops                                                                                                                      
        "p" :"\u0070",               // LATIN SMALL LETTER P
        "t" :"\u0074",               // LATIN SMALL LETTER T
        "k" :"\u006B",               // LATIN SMALL LETTER K
        "kw":"\u006B\u02B7",         // LATIN SMALL LETTER K                             with MODIFIER LETTER SMALL W
        "q" :"\u0071",               // LATIN SMALL LETTER Q
        "qw":"\u0071\u02B7",         // LATIN SMALL LETTER Q                             with MODIFIER LETTER SMALL W

        // Voiced fricatives                                                                                                          
        "v"  :"\u0076",              // LATIN SMALL LETTER V
        "l"  :"\u006C",              // LATIN SMALL LETTER L
        "z"  :"\u007A",              // LATIN SMALL LETTER Z
        "y"  :"\u0079",              // LATIN SMALL LETTER Y
        "r"  :"\u0072",              // LATIN SMALL LETTER R
        "g"  :"\u0263",              // LATIN SMALL LETTER GAMMA
        "w"  :"\u0263\u02B7",        // LATIN SMALL LETTER GAMMA                         with MODIFIER LETTER SMALL W
        "gh" :"\u0263\u0307",        // LATIN SMALL LETTER GAMMA with COMBINING DOT ABOVE
        "ghw":"\u0263\u0307\u02B7",  // LATIN SMALL LETTER GAMMA with COMBINING DOT ABOVE and MODIFIER LETTER SMALL W

        // Voiceless fricatives                                                                                                       
        "f"   :"\u0066",             // LATIN SMALL LETTER F
        "ll"  :"\u026C",             // LATIN SMALL LETTER L WITH BELT
        "s"   :"\u0073",             // LATIN SMALL LETTER S
        "rr"  :"\u0072\u0325",       // LATIN SMALL LETTER R   with COMBINING RING BELOW
        "gg"  :"\u0078",             // LATIN SMALL LETTER X
        "wh"  :"\u0078\u02B7",       // LATIN SMALL LETTER X                             with MODIFIER LETTER SMALL W
        "ghh" :"\u0078\u0323",       // LATIN SMALL LETTER X   with COMBINING DOT BELOW
        "ghhw":"\u0078\u0323\u02B7", // LATIN SMALL LETTER X   with COMBINING DOT BELOW   and MODIFIER LETTER SMALL W
        "h"   :"\u0068",             // LATIN SMALL LETTER H

        // Voiced nasals                                                                                                              
        "m"  :"\u006D",              // LATIN SMALL LETTER M
        "n"  :"\u006E",              // LATIN SMALL LETTER N
        "ng" :"\u014B",              // LATIN SMALL LETTER ENG
        "ngw":"\u014B\u02B7",        // LATIN SMALL LETTER ENG                          with MODIFIER LETTER SMALL W

        // Voiceless nasals                                                                                                           
        "mm":"\u006D\u0325",          // LATIN SMALL LETTER M   with COMBINING RING BELOW
        "nn":"\u006E\u0325",          // LATIN SMALL LETTER N   with COMBINING RING BELOW
        "ngng":"\u014B\u030A",        // LATIN SMALL LETTER ENG with COMBINING RING ABOVE
        "ngngw":"\u014B\u030A\u02B7", // LATIN SMALL LETTER ENG with COMBINING RING ABOVE and MODIFIER LETTER SMALL W
    }

    var result = []

    for (var i=0; i<graphemes.length; i++) {
        var grapheme = graphemes[i]

        if (grapheme in nagai2001) {
            result.push(nagai2001[grapheme])
        } else if (isAlpha(grapheme)) {
            result.push(grapheme)
        }
    }
	
    return result
}


// Rewrites all double (long) vowels into their IPA single vowel counterpart
function ipa_adjust_doubleVowel(graphemes) {

    var doubleVowel = {
        "\u0069":"\u0069\u02D0",                // LATIN SMALL LETTER I to I with IPA COLON
        "\u0251":"\u0251\u02D0",                // LATIN SMALL LETTER ALPHA to ALPHA with IPA COLON
        "\u0075":"\u0075\u02D0",                // LATIN SMALL LETTER U to U with IPA COLON

        "\u0069\u0301":"\u0069\u0301\u02D0",    // LATIN SMALL LETTER I with ACUTE ACCENT to I with IPA COLON and ACUTE ACCENT 
        "\u0251\u0301":"\u0251\u0301\u02D0",    // LATIN SMALL LETTER ALPHA with ACUTE ACCENT to ALPHA with IPA COLON and ACUTE ACCENT
        "\u0075\u0301":"\u0075\u0301\u02D0",    // LATIN SMALL LETTER U with ACUTE ACCENT to U with IPA COLON and ACUTE ACCENT 
        
         "\u0069\u0302":"\u0069\u0301\u02D0\u02D0",    // LATIN SMALL LETTER I with CIRCUMFLEX ACCENT to I with TWO IPA COLONS and ACUTE ACCENT 
         "\u0251\u0302":"\u0251\u0301\u02D0\u02D0",    // LATIN SMALL LETTER ALPHA with CIRCUMFLEX ACCENT to ALPHA with TWO IPA COLONS and ACUTE ACCENT 
         "\u0075\u0302":"\u0075\u0301\u02D0\u02D0",    // LATIN SMALL LETTER U with CIRCUMFLEX ACCENT to U with TWO IPA COLONS and ACUTE ACCENT 
    }

    var stressedVowel = new Set(['\u0069\u0301', '\u0251\u0301', '\u0075\u0301', '\u0069\u0302', '\u0251\u0302', '\u0075\u0302'])

    var result = []

    for (var i = 0; i < graphemes.length; i++) {
        var grapheme = graphemes[i]

        if (grapheme in doubleVowel && grapheme == graphemes[i+1]) {
            result.push(doubleVowel[grapheme])
            i++
        } else if (stressedVowel.has(grapheme)) {
            if (graphemes[i-1] in doubleVowel) {
                result[result.length - 1] = doubleVowel[grapheme]
            } else {
                result.push(grapheme)
            }
        } else if (grapheme in doubleVowel && stressedVowel.has(grapheme)) {
            result.push(doubleVowel[grapheme])
            i++
        } else {
            result.push(grapheme)
        }
    }
	
    return result
}


// Transliterates Latin letters to Cyrillic letters one-to-one
function latin_to_cyrillic(graphemes) {
    
    var shortVowels = {
        "i":"\u0438",                // CYRILLIC SMALL LETTER I 
        "a":"\u0430",                // CYRILLIC SMALL LETTER A
        "u":"\u0443",                // CYRILLIC SMALL LETTER U
        "e":"\u044B",                // CYRILLIC SMALL LETTER YERU

        "I":"\u0418",                // I to CYRILLIC CAPITAL LETTER I
        "A":"\u0410",                // A to CYRILLIC CAPITAL LETTER A
        "U":"\u0423",                // U to CYRILLIC CAPITAL LETTER U
        "E":"\u042B",                // E to CYRILLIC CAPITAL LETTER YERU
    }

    var consonants= {
        // Stops                                                                                                                      
        "p" :"\u043F",               // CYRILLIC SMALL LETTER PE
        "t" :"\u0442",               // CYRILLIC SMALL LETTER TE
        "k" :"\u043A",               // CYRILLIC SMALL LETTER KA
        "kw":"\u043A\u04F1",         // CYRILLIC SMALL LETTER KA and SMALL LETTER U with DIERESIS
        "q" :"\u049B",               // CYRILLIC SMALL LETTER KA with DESCENDER
        "qw":"\u049B\u04F1",         // CYRILLIC SMALL LETTER KA with DESCENDER and SMALL LETTER U with DIERESIS 

        "P" :"\u041F",               // CYRILLIC CAPITAL LETTER PE
        "T" :"\u0422",               // CYRILLIC CAPITAL LETTER TE
        "K" :"\u041A",               // CYRILLIC CAPITAL LETTER KA
        "Kw":"\u041A\u04F1",         // CYRILLIC CAPITAL LETTER KA and SMALL LETTER U with DIERESIS
        "Q" :"\u049A",               // CYRILLIC CAPITAL LETTER KA with DESCENDER
        "Qw":"\u049A\u04F1",         // CYRILLIC CAPITAL LETTER KA with DESCENDER and SMALL LETTER U with DIERESIS
        
        // Voiced fricatives                                                                                                          
        "v"  :"\u0432",              // CYRILLIC SMALL LETTER VE
        "l"  :"\u043B",              // CYRILLIC SMALL LETTER EL
        "z"  :"\u0437",              // CYRILLIC SMALL LETTER ZE
        "y"  :"\u04E5",              // CYRILLIC SMALL LETTER I with DIERESIS
        "r"  :"\u0440",              // CYRILLIC SMALL LETTER ER
        "g"  :"\u0433",              // CYRILLIC SMALL LETTER GHE
        "w"  :"\u04F1",              // CYRILLIC SMALL LETTER U with DIERESIS 
        "gh" :"\u04F7",              // CYRILLIC SMALL LETTER GHE with DESCENDER
        "ghw":"\u04F7\u04F1",        // CYRILLIC SMALL LETTER GHE with DESCENDER and SMALL LETTER U with DIERESIS 

        "V"  :"\u0412",              // CYRILLIC CAPITAL LETTER VE
        "L"  :"\u041B",              // CYRILLIC CAPITAL LETTER EL
        "Z"  :"\u0417",              // CYRILLIC CAPITAL LETTER ZE
        "Y"  :"\u04E4",              // CYRILLIC CAPITAL LETTER I with DIERESIS
        "R"  :"\u0420",              // CYRILLIC CAPITAL LETTER ER
        "G"  :"\u0413",              // CYRILLIC CAPITAL LETTER GHE
        "W"  :"\u04F0",              // CYRILLIC CAPITAL LETTER U with DIERESIS 
        "Gh" :"\u04F6",              // CYRILLIC CAPITAL LETTER GHE with DESCENDER
        "Ghw":"\u04F6\u04F1",        // CYRILLIC CAPITAL LETTER GHE with DESCENDER

        // Voiceless fricatives                                                                                                       
        "f"   :"\u0444",             // CYRILLIC SMALL LETTER EF
        "ll"  :"\u043B\u044C",       // CYRILLIC SMALL LETTER EL and SMALL LETTER SOFT SIGN
        "s"   :"\u0441",             // CYRILLIC SMALL LETTER ES
        "rr"  :"\u0448",             // CYRILLIC SMALL LETTER SHA
        "gg"  :"\u0445",             // CYRILLIC SMALL LETTER HA
        "wh"  :"\u0445\u04F1",       // CYRILLIC SMALL LETTER HA and SMALL LETTER U with DIERESIS
        "ghh" :"\u04B3",             // CYRILLIC SMALL LETTER HA with DESCENDER
        "ghhw":"\u04B3\u04F1",       // CYRILLIC SMALL LETTER HA with DESCENDER and SMALL LETTER U with DIERESIS
        "h"   :"\u0433",             // CYRILLIC SMALL LETTER GHE

        "F"   :"\u0444",             // CYRILLIC CAPITAL LETTER EF
        "Ll"  :"\u041B\u044C",       // CYRILLIC CAPITAL LETTER EL and SMALL LETTER SOFT SIGN
        "S"   :"\u0421",             // CYRILLIC CAPITAL LETTER ES
        "Rr"  :"\u0428",             // CYRILLIC CAPITAL LETTER SHA 
        "Gg"  :"\u0425",             // CYRILLIC CAPITAL LETTER HA 
        "Wh"  :"\u0425\u04F1",       // CYRILLIC CAPITAL LETTER HA and SMALL LETTER U with DIERESIS 
        "Ghh" :"\u04B2",             // CYRILLIC CAPITAL LETTER HA with DESCENDER 
        "Ghhw":"\u04B2\u04F1",       // CYRILLIC CAPITAL LETTER HA with DESCENDER and SMALL LETTER U with DIERESIS 
        "H"   :"\u0413",             // CYRILLIC CAPITAL LETTER GHE

        // Voiced nasals                                                                                                              
        "m"  :"\u043C",              // CYRILLIC SMALL LETTER EM
        "n"  :"\u043D",              // CYRILLIC SMALL LETTER EN
        "ng" :"\u04A3",              // CYRILLIC SMALL LETTER EN with DESCENDER
        "ngw":"\u04A3\u04F1",        // CYRILLIC SMALL LETTER EN with DESCENDER and SMALL LETTER U with DIERESIS

        "M"  :"\u041C",              // CYRILLIC CAPITAL LETTER EM
        "N"  :"\u041D",              // CYRILLIC CAPITAL LETTER EN
        "Ng" :"\u04A2",              // CYRILLIC CAPITAL LETTER EN with DESCENDER
        "Ngw":"\u04A2\u04F1",        // CYRILLIC CAPITAL LETTER EN with DESCENDER and SMALL LETTER U with DIERESIS

        // Voiceless nasals                                                                                                           
        "mm":"\u043C\u044C",          // CYRILLIC SMALL LETTER EM and SMALL LETTER SOFT SIGN
        "nn":"\u043D\u044C",          // CYRILLIC SMALL LETTER EN and SMALL LETTER SOFT SIGN
        "ngng":"\u04A3\u044C",        // CYRILLIC SMALL LETTER EN with DESCENDER and SMALL LETTER SOFT SIGN
        "ngngw":"\u04A3\u044C\u04F1", // CYRILLIC SMALL LETTER EN with DESCENDER & SMALL LETTER SOFT SIGN & SMALL LETTER U with DIERESIS

        "Mm":"\u041C\u044C",          // CYRILLIC CAPITAL LETTER EM and SMALL LETTER SOFT SIGN
        "Nn":"\u041D\u044C",          // CYRILLIC CAPITAL LETTER EN and SMALL LETTER SOFT SIGN
        "Ngng":"\u04A2\u044C",        // CYRILLIC CAPITAL LETTER EN with DESCENDER and SMALL LETTER SOFT SIGN
        "Ngngw":"\u04A2\u044C\u04F1", // CYRILLIC CAPITAL LETTER EN with DESCENDER & SMALL LETTER SOFT SIGN & SMALL LETTER U with DIERESIS
    }

    var result = []

    for (var i = 0; i < graphemes.length; i++) {
        var grapheme = graphemes[i]

        if (grapheme in shortVowels) {
            result.push(shortVowels[grapheme])
        } else if (grapheme in consonants) {
            result.push(consonants[grapheme])
        } else {
            result.push(grapheme)
        }
    }
	
    return result
}


// Rewrites all double (long) vowels into their Cyrillic single vowel counterpart
function cyrillic_adjust_doubleVowel(graphemes) {

    var doubleVowel = {
        "\u0438":"\u04E3",                // CYRILLIC SMALL LETTER I to I with MACRON
        "\u0430":"\u0430\u0304",          // CYRILLIC SMALL LETTER A to A with MACRON
        "\u0443":"\u04EF",                // CYRILLIC SMALL LETTER U to U with MACRON

        "\u0418":"\u04E2",                // CYRILLIC CAPITAL LETTER I to I with MACRON
        "\u0410":"\u0410\u0304",          // CYRILLIC CAPITAL LETTER A to A with MACRON
        "\u0423":"\u04EE",                // CYRILLIC CAPITAL LETTER U to U with MACRON

        "\u0438\u0301":"\u04E3\u0301",          // CYRILLIC SMALL LETTER I with ACUTE ACCENT to I with MACRON and ACUTE ACCENT 
        "\u0430\u0301":"\u0430\u0304\u0301",    // CYRILLIC SMALL LETTER A with ACUTE ACCENT to A with MACRON and ACUTE ACCENT
        "\u0443\u0301":"\u04EF\u0301",          // CYRILLIC SMALL LETTER U with ACUTE ACCENT to U with MACRON and ACUTE ACCENT 
        
        "\u0438\u0302":"\u04E3\u0302",          // CYRILLIC SMALL LETTER I with CIRCUMFLEX to I with MACRON and CIRCUMFLEX
        "\u0430\u0302":"\u0430\u0304\u0302",    // CYRILLIC SMALL LETTER A with CIRCUMFLEX to A with MACRON and CIRCUMFLEX
        "\u0443\u0302":"\u04EF\u0302",          // CYRILLIC SMALL LETTER U with CIRCUMFLEX to U with MACRON and CIRCUMFLEX 
    }

    var stressedVowel = new Set(['\u0438\u0301', '\u0430\u0301', '\u0443\u0301', '\u0438\u0302', '\u0430\u0302', '\u0443\u0302'])

    var result = []

    for (var i = 0; i < graphemes.length; i++) {
        var grapheme = graphemes[i]

        if (grapheme in doubleVowel && grapheme == graphemes[i+1]) {
            result.push(doubleVowel[grapheme])
            i++
        } else if (grapheme in doubleVowel && grapheme.toLowerCase() == graphemes[i+1]) {
            result.push(doubleVowel[grapheme])
            i++
        } else if (stressedVowel.has(grapheme)) {
            if (graphemes[i-1] in doubleVowel) {
                result[i-1] = doubleVowel[grapheme]
            } else {
                result.push(grapheme)
            }
        } else if (grapheme in doubleVowel && stressedVowel.has(grapheme)) {
            result.push(doubleVowel[grapheme])
            i++
        } else {
            result.push(grapheme)
        }
    }
	
    return result
}


// Applies Cyrillic orthography adjustments
function cyrillic_adjustments(graphemes) {

    cyr_graphemes = cyrillic_adjust_doubleVowel(graphemes)

    var au_for_capitals = {
        "\u0430":"\u042F",                      // CYRILLIC SMALL LETTER A to CAPITAL LETTER YA
        "\u0443":"\u042E",                      // CYRILLIC SMALL LETTER U to CAPITAL LETTER YU
 
        "\u0430\u0304":"\u042F\u0304",          // CYRILLIC SMALL LETTER A with MACRON to CAPITAL LETTER YA with MACRON
        "\u04EF":"\u042E\u0304",                // CYRILLIC SMALL LETTER U with MACRON to CAPITAL LETTER YU with MACRON
    }

    var shortAU = {
        "\u0430":"\u044F",                      // CYRILLIC SMALL LETTER A to SMALL LETTER YA
        "\u0443":"\u044E",                      // CYRILLIC SMALL LETTER U to SMALL LETTER YU

        "\u0430\u0301":"\u044F\u0301",          // CYRILLIC SMALL LETTER A with ACUTE ACCENT to SMALL LETTER YA with ACUTE ACCENT
        "\u0443\u0301":"\u044E\u0301",          // CYRILLIC SMALL LETTER U with ACUTE ACCENT to SMALL LETTER YU with ACUTE ACCENT

        "\u0430\u0302":"\u044F\u0302",          // CYRILLIC SMALL LETTER A with CIRCUMFLEX to SMALL LETTER YA with CIRCUMFLEX
        "\u0443\u0302":"\u044E\u0302",          // CYRILLIC SMALL LETTER U with CIRCUMFLEX to SMALL LETTER YU with CIRCUMFLEX
    }

    var longAU = {
        "\u0430\u0304":"\u044F\u0304",          // CYRILLIC SMALL LETTER A with MACRON to SMALL LETTER YA with MACRON
        "\u04EF":"\u044E\u0304",                // CYRILLIC SMALL LETTER U with MACRON to SMALL LETTER YU with MACRON

        "\u0430\u0304\u0301":"\u044F\u0304\u0301",    // A with MACRON and ACUTE to YA with MACRON and ACUTE
        "\u04EF\u0301":"\u044E\u0304\u0301",          // U with MACRON and ACUTE to YU with MACRON and ACUTE

        "\u0430\u0304\u0302":"\u044F\u0304\u0302",    // A with MACRON and CIRCUMFLEX to YA with MACRON and CIRCUMFLEX
        "\u04EF\u0302":"\u044E\u0304\u0302",          // U with MACRON and CIRCUMFLEX to YU with MACRON and CIRCUMFLEX
    }

    var vowels = {      
        "\u0438":"i",              // CYRILLIC SMALL LETTER I 
        "\u0430":"a",              // CYRILLIC SMALL LETTER A
        "\u0443":"u",              // CYRILLIC SMALL LETTER U
        "\u044B":"e",              // CYRILLIC SMALL LETTER YERU
        "\u04E3":"ii",             // CYRILLIC SMALL LETTER I with MACRON
        "\u0430\u0304":"aa",       // CYRILLIC SMALL LETTER A with MACRON
        "\u04EF":"uu",             // CYRILLIC SMALL LETTER U with MACRON
    } 

    var lzlls = {
        "\u043B":"l",              // CYRILLIC SMALL LETTER EL
        "\u0437":"z",              // CYRILLIC SMALL LETTER ZE
        "\u043B\u044C":"ll",       // CYRILLIC SMALL LETTER EL and SMALL LETTER SOFT SIGN
        "\u0441":"s",              // CYRILLIC SMALL LETTER ES

        "\u041B":"L",              // CYRILLIC CAPITAL LETTER EL
        "\u0417":"Z",              // CYRILLIC CAPITAL LETTER ZE
        "\u0421":"S",              // CYRILLIC CAPITAL LETTER ES
        "\u041B\u044C":"Ll",       // CYRILLIC CAPITAL LETTER EL and SMALL LETTER SOFT SIGN
    } 

    // Swaps position of the labialization symbol, i.e. Small Letter U with Dieresis
    var labialC = {
        "\u043A\u04F1":"\u04F1\u043A",             // CYRILLIC SMALL LETTER KA and SMALL LETTER U with DIERESIS
        "\u049B\u04F1":"\u04F1\u049B",             // CYRILLIC SMALL LETTER KA with DESCENDER and SMALL LETTER U with DIERESIS 
        "\u04F7\u04F1":"\u04F1\u04F7",             // CYRILLIC SMALL LETTER GHE with DESCENDER and SMALL LETTER U with DIERESIS 
        "\u0445\u04F1":"\u04F1\u0445",             // CYRILLIC SMALL LETTER HA and SMALL LETTER U with DIERESIS
        "\u04B3\u04F1":"\u04F1\u04B3",             // CYRILLIC SMALL LETTER HA with DESCENDER and SMALL LETTER U with DIERESIS
        "\u04A3\u04F1":"\u04F1\u04A3",             // CYRILLIC SMALL LETTER EN with DESCENDER and SMALL LETTER U with DIERESIS
        "\u04A3\u044C\u04F1":"\u04F1\u04A3\u044C", // CYRILLIC SMALL LETTER EN with DESCENDER & SMALL LETTER SOFT SIGN
                                                   // & SMALL LETTER U with DIERESIS
    }

    var voicelessC = {
        // Stops                                                                                                                      
        "\u043F":"p",                       // CYRILLIC SMALL LETTER PE
        "\u0442":"t",                       // CYRILLIC SMALL LETTER TE
        "\u043A":"k",                       // CYRILLIC SMALL LETTER KA
        "\u043A\u04F1":"kw",                // CYRILLIC SMALL LETTER KA and SMALL LETTER U with DIERESIS
        "\u049B":"q",                       // CYRILLIC SMALL LETTER KA with DESCENDER
        "\u049B\u04F1":"qw",                // CYRILLIC SMALL LETTER KA with DESCENDER and SMALL LETTER U with DIERESIS 

        // Voiceless fricatives                                                                                                       
        "\u0444":"ff",                      // CYRILLIC SMALL LETTER EF
        "\u043B\u044C":"ll",                // CYRILLIC SMALL LETTER EL and SMALL LETTER SOFT SIGN
        "\u0441":"s",                       // CYRILLIC SMALL LETTER ES
        "\u0448":"rr",                      // CYRILLIC SMALL LETTER SHA
        "\u0445":"gg",                      // CYRILLIC SMALL LETTER HA
        "\u0445\u04F1":"wh",                // CYRILLIC SMALL LETTER HA and SMALL LETTER U with DIERESIS
        "\u04B3":"ghh",                     // CYRILLIC SMALL LETTER HA with DESCENDER
        "\u04B3\u04F1":"ghhw",              // CYRILLIC SMALL LETTER HA with DESCENDER and SMALL LETTER U with DIERESIS
        "\u0433":"h",                       // CYRILLIC SMALL LETTER GHE

        // Voiceless nasals                                                                                                           
        "\u043C\u044C":"mm",                // CYRILLIC SMALL LETTER EM and SMALL LETTER SOFT SIGN
        "\u043D\u044C":"nn",                // CYRILLIC SMALL LETTER EN and SMALL LETTER SOFT SIGN
        "\u04A3\u044C":"ngng",              // CYRILLIC SMALL LETTER EN with DESCENDER and SMALL LETTER SOFT SIGN
        "\u04A3\u044C\u04F1":"ngngw",       // CYRILLIC SMALL LETTER EN with DESCENDER & SMALL LETTER SOFT SIGN & SMALL LETTER U with DIERESIS
    }
    
    // Removes devoicing sign, i.e. Small Letter Soft Sign
    var voicelessNasals = {
        "\u043C\u044C":"\u043C",             // CYRILLIC SMALL LETTER EM and SMALL LETTER SOFT SIGN
        "\u043D\u044C":"\u043D",             // CYRILLIC SMALL LETTER EN and SMALL LETTER SOFT SIGN
        "\u04A3\u044C":"\u04A3",             // CYRILLIC SMALL LETTER EN with DESCENDER and SMALL LETTER SOFT SIGN
        "\u04A3\u044C\u04F1":"\u04A3\u04F1", // CYRILLIC SMALL LETTER EN with DESCENDER & SMALL LETTER SOFT SIGN
    }                                        // & SMALL LETTER U with DIERESIS

    var result = []

    for (var i = 0; i < cyr_graphemes.length; i++) {
        var grapheme = cyr_graphemes[i]

        // ADJUSTMENT 1: The Cyrillic pairings of 'y-a', 'y-u', 'y-aa', 'y-uu'are rewritten
        // into Cyrillic YA, YU, YA WITH MACRON, YU with MACRON respectively
        // First checks if grapheme is Cyrillic 'y'
        if (grapheme == "\u04E4" && (i < cyr_graphemes.length - 1)) {
            after_for_capitals = cyr_graphemes[i+1]

            if (after_for_capitals in au_for_capitals) {
                result.push(au_for_capitals[after_for_capitals])
                i++
            } else {
                result.push(grapheme)
            }
        } else if (grapheme == "\u04E5" && (i < cyr_graphemes.length - 1)) {    
            after = cyr_graphemes[i+1]

            if (after in shortAU) {
            // ADJUSTMENT 2: If 'ya' or 'yu' follow a consonant, insert a Cyrillic soft sign between
                if (i > 0 && isAlpha(cyr_graphemes[i-1]) && !(cyr_graphemes[i-1] in vowels)) {
                    result.push("\u044C")
                }
                result.push(shortAU[after])
                i++
            } else if (after in longAU) {
                result.push(longAU[after])
                i++
            } else {
                result.push(grapheme)
            }
        } 

        // ADJUSTMENT 3: The 'a', 'u' Cyrillic representations are rewritten 
        // if they follow the Cyrillic representations of 'l', 'z', 'll', 's'
        else if (i > 0 && grapheme in shortAU && cyr_graphemes[i-1] in lzlls) {
            result.push(shortAU[grapheme])
        }
    
        // ADJUSTMENT - Labialization symbol can appear either before or after
        // the consonant it labializes. It moves to appear next to a vowel 
        else if (i > 0 && grapheme in labialC && cyr_graphemes[i-1] in vowels) {
            result.push(labialC[grapheme])
        }

        // ADJUSTMENT - Cyrillic representation of 'e' deletes before a voiceless
        // consonant cluster
        else if (grapheme == "\u042B" && (i < cyr_graphemes.length - 2) &&
            cyr_graphemes[i+1] in voicelessC && cyr_graphemes[i+2] in voicelessC) {
            result.push("")
            result.push(cyr_graphemes[i+1].toUpperCase())
            i++
        } else if (grapheme == "\u044B" && (i < cyr_graphemes.length - 2) &&
            cyr_graphemes[i+1] in voicelessC && cyr_graphemes[i+2] in voicelessC) {
            result.push("") 
        }

        // ADJUSTMENT - Devoicing sign is omitted for a voiceless nasal if it
        // appears after a voiceless consonant
        else if (i > 0 && grapheme in voicelessNasals && cyr_graphemes[i-1] in voicelessC) {
            result.push(voicelessNasals[grapheme])
        }

        // No adjustments applicable
        else {
            result.push(grapheme)
        }

    } // End 'for' Loop

    return result
}


function syllabify(graphemes, vowels, ipa_format) {

    // Convert graphemes to consonant "c" or vowel "v"
    var c_v = []

    for (var i = 0; i < graphemes.length; i++) {
        var grapheme = graphemes[i]

        if (vowels.has(grapheme)) {
            c_v.push("v")
        } else {
            c_v.push("c")
        }
    }

    // Define syllable boundaries, between 'c' and 'c' & 'v' and 'c'
    var result = []    // A list of lists, where each embedded list is a syllable
    var syllable = []
    var syllable_count = 1

    for (var i = 0; i < c_v.length; i++) {
        var grapheme = c_v[i]

        if (grapheme == "c") {
            if (i == 0) {
                syllable.push(graphemes[i])
            } else if (i == c_v.length - 1) {
                if (ipa_format) {
                    syllable.push(graphemes[i])
                } else {
                    syllable.push(graphemes[i], syllable_count)
                }
                result.push(syllable)

                syllable = []
            } else {
                if (c_v[i+1] == "c") {
                    if (ipa_format) {
                        syllable.push(graphemes[i], ".")
                    } else {
                        syllable.push(graphemes[i], syllable_count, "/")
                    }
                    result.push(syllable)
                    syllable_count += 1

                    syllable = []
                } else if (c_v[i-1] == "v") {
                    if (ipa_format) {
                        syllable.push(".")
                    } else {
                        syllable.push(syllable_count, "/")
                    }
                    result.push(syllable)
                    syllable_count += 1

                    syllable = []
                    syllable.push(graphemes[i])
                } else if (c_v[i-1] == "c") {
                    syllable.push(graphemes[i])
                }
            }
        }
        else {
            if (i == c_v.length - 1) {
                if (ipa_format) {
                    syllable.push(graphemes[i])
                } else {
                    syllable.push(graphemes[i], syllable_count)
                }
                result.push(syllable)

                syllable = []
            } else {
                syllable.push(graphemes[i])
            }
        }
    } // End 'for' Loop

    return result 
}


function stress(syllableList, vowels, ipa_format) {

    var acute = {
        "i":"í",
        "a":"á",
        "u":"ú",
        "e":"é",

        "\u0069":"\u0069\u0301",    // LATIN SMALL LETTER I to I with ACUTE ACCENT
        "\u0251":"\u0251\u0301",    // LATIN SMALL LETTER ALPHA to ALPHA with ACUTE ACCENT
        "\u0075":"\u0075\u0301",    // LATIN SMALL LETTER U to U with ACUTE ACCENT
        "\u0259":"\u0259\u0301",    // LATIN SMALL LETTER SCHWA to SCHWA with ACUTE ACCENT

        "\u0438":"\u0438\u0301",    // CYRILLIC SMALL LETTER I to I with ACUTE ACCENT
        "\u0430":"\u0430\u0301",    // CYRILLIC SMALL LETTER A to A with ACUTE ACCENT
        "\u0443":"\u0443\u0301",    // CYRILLIC SMALL LETTER U to U with ACUTE ACCENT
        "\u044B":"\u044B\u0301",    // CYRILLIC SMALL LETTER YERU to YERU with ACUTE ACCENT
    }

    var circumflex = {
        "i":"î",
        "a":"â",
        "u":"û",
        "e":"é",

        "\u0069":"\u0069\u0302",    // LATIN SMALL LETTER I to I with CIRCUMFLEX ACCENT
        "\u0251":"\u0251\u0302",    // LATIN SMALL LETTER ALPHA to ALPHA with CIRCUMFLEX ACCENT
        "\u0075":"\u0075\u0302",    // LATIN SMALL LETTER U to U with CIRCUMFLEX ACCENT
        "\u0259":"\u0259\u0301",    // LATIN SMALL LETTER SCHWA to SCHWA with ACUTE ACCENT

        "\u0438":"\u0438\u0302",    // CYRILLIC SMALL LETTER I to I with CIRCUMFLEX
        "\u0430":"\u0430\u0302",    // CYRILLIC SMALL LETTER A to A with CIRCUMFLEX
        "\u0443":"\u0443\u0302",    // CYRILLIC SMALL LETTER U to U with CIRCUMFLEX
        "\u044B":"\u044B\u0301",    // CYRILLIC SMALL LETTER YERU to YERU with ACUTE ACCENT
    }

    // Mark stress patterns
    var result = []
    var vowel_count = 0

    for (var s = 0; s < syllableList.length; s++) {
        for (var i = 0; i < syllableList[s].length; i++) {
            grapheme = syllableList[s][i]

            if (vowels.has(grapheme)) {
                vowel_count += 1
                // Stress applicable
                if ((vowel_count % 2 == 0) && (s != syllableList.length - 1)) {
                    before = syllableList[s][i-1]
                    after = syllableList[s][i+1]
                    after2 = syllableList[s][i+2]
                    // Grapheme is first vowel in a long vowel in an open syllable
                    if (vowels.has(after) && !isAlpha(after2.toString())) {
                        result.push(grapheme, circumflex[grapheme])
                        i += 1
                    }
                    // Grapheme is first vowel in a long vowel in a closed syllable
                    else if (vowels.has(after) && !vowels.has(after2)) {
                        result.push(grapheme, acute[grapheme])
                        i += 1
                    }
                    // Grapheme is second vowel in a long vowel in an open syllable
                    else if (vowels.has(before) && !isAlpha(after.toString())) {
                        result.push(acute[grapheme])
                    }
                    // Grapheme is second vowel in a long vowel in a closed syllable
                    else if (vowels.has(before) && !vowels.has(after)) {
                        result.push(acute[grapheme])
                    }
                    // Grapheme is a short vowel in an open syllable
                    else if (!vowels.has(before) && !isAlpha(after.toString())) {
                        result.push(circumflex[grapheme])
                    }
                    // Grapheme is a short vowel in a closed syllable
                    else if (!vowels.has(before) && !vowels.has(after)) {
                        result.push(acute[grapheme])
                    } 
                // Vowel where stress is not applicable
                } else {
                    result.push(grapheme)
                }
            // Consonants, syllable boundaries where stress is not applicable
            } else {
                result.push(grapheme)
            }
          
        } // End syllable 'for' Loop
    } // End syllableList 'for' Loop

    return result
}


function find_syllable_boundary(arr) {
    for (var i = arr.length - 1; i >= 0; i--) {
        var grapheme = arr[i]

        if (i == 0) {
            return i 
        } else if (grapheme == '.') {
            return i
        }
    }
}


function ipa_format_stress(ipa_graphemes) {
    var graphemes = ipa_adjust_doubleVowel(ipa_graphemes)

    var stressedVowel = {
        "\u0069\u0301":"\u0069",                // LATIN SMALL LETTER I with ACUTE to I
        "\u0251\u0301":"\u0251",                // LATIN SMALL LETTER ALPHA with ACUTE to ALPHA
        "\u0075\u0301":"\u0075",                // LATIN SMALL LETTER U with ACUTE to U
        "\u0259\u0301":"\u0259",                // LATIN SMALL LETTER SCHWA with ACUTE to SCHWA

        "\u0069\u0302":"\u0069\u02D0",          // LATIN SMALL LETTER I with CIRCUMFLEX to I with IPA COLON
        "\u0251\u0302":"\u0251\u02D0",          // LATIN SMALL LETTER ALPHA with CIRCUMFLEX to ALPHA with IPA COLON
        "\u0075\u0302":"\u0075\u02D0",          // LATIN SMALL LETTER U with CIRCUMFLEX to U with IPA COLON

        "\u0069\u0301\u02D0":"\u0069\u02D0",    // LATIN SMALL LETTER I with ACUTE and IPA COLON to I with IPA COLON
        "\u0251\u0301\u02D0":"\u0251\u02D0",    // LATIN SMALL LETTER ALPHA with ACUTE and IPA COLON to ALPHA with IPA COLON
        "\u0075\u0301\u02D0":"\u0075\u02D0",    // LATIN SMALL LETTER U with ACUTE and IPA COLON to U with IPA COLON

        "\u0069\u0301\u02D0\u02D0":"\u0069\u02D0\u02D0",    // LATIN SMALL LETTER I with ACUTE and TWO IPA COLONS to I with TWO IPA COLONS
        "\u0251\u0301\u02D0\u02D0":"\u0251\u02D0\u02D0",    // LATIN SMALL LETTER ALPHA with ACUTE and TWO IPA COLONS to ALPHA with TWO IPA COLONS
        "\u0075\u0301\u02D0\u02D0":"\u0075\u02D0\u02D0",    // LATIN SMALL LETTER U with ACUTE and TWO IPA COLONS to U with TWO IPA COLONS
    }

    var result = []

    for (var i = 0; i < graphemes.length; i++) {
        grapheme = graphemes[i]

        if (grapheme in stressedVowel) {
            result.push(stressedVowel[grapheme])
           
            index = find_syllable_boundary(result)
            if (index == 0) {
                result.splice(index, 0, "'")
            } else {
                result.splice(index + 1, 0, "'") 
            }
        } else {
            result.push(grapheme)
        }
    }

    return result 
}
