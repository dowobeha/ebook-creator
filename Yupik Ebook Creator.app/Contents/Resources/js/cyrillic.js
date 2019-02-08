function tokenize_cyr(word, keep_punctuation) {
    if (keep_punctuation === undefined) {
        keep_punctuation = false
    }

    var graphemes = ["\u04A2\u044C\u04F1", // CYRILLIC CAPITAL LETTER EN with DESCENDER & SMALL LETTER SOFT SIGN & SMALL LETTER U with DIERESIS
                     "\u04A3\u044C\u04F1", // CYRILLIC SMALL LETTER EN with DESCENDER & SMALL LETTER SOFT SIGN & SMALL LETTER U with DIERESIS
                     "\u04A2\u044C",       // CYRILLIC CAPITAL LETTER EN with DESCENDER and SMALL LETTER SOFT SIGN
                     "\u04A3\u044C",       // CYRILLIC SMALL LETTER EN with DESCENDER and SMALL LETTER SOFT SIGN
                     "\u04A2\u04F1",       // CYRILLIC CAPITAL LETTER EN with DESCENDER and SMALL LETTER U with DIERESIS
                     "\u04A3\u04F1",       // CYRILLIC SMALL LETTER EN with DESCENDER and SMALL LETTER U with DIERESIS
                     "\u04B2\u04F1",       // CYRILLIC CAPITAL LETTER HA with DESCENDER and SMALL LETTER U with DIERESIS
                     "\u04B3\u04F1",       // CYRILLIC SMALL HA with DESCENDER and SMALL LETTER U with DIERESIS
                     "\u04F6\u04F1",       // CYRILLIC CAPITAL LETTER GHE with DESCENDER
                     "\u04F7\u04F1",       // CYRILLIC SMALL LETTER GHE with DESCENDER
                     "\u041A\u04F1",       // CYRILLIC CAPITAL LETTER KA and SMALL LETTER U with DIERESIS
                     "\u043A\u04F1",       // CYRILLIC SMALL LETTER KA and SMALL LETTER U with DIERESIS
                     "\u041B\u044C",       // CYRILLIC CAPITAL LETTER EL and SMALL LETTER SOFT SIGN
                     "\u043B\u044C",       // CYRILLIC SMALL LETTER EL and SMALL LETTER SOFT SIGN
                     "\u041D\u044C",       // CYRILLIC CAPITAL LETTER EN and SMALL LETTER SOFT SIGN
                     "\u043D\u044C",       // CYRILLIC SMALL LETTER EN and SMALL LETTER SOFT SIGN
                     "\u0425\u04F1",       // CYRILLIC CAPITAL LETTER HA and SMALL LETTER U with DIERESIS 
                     "\u0445\u04F1",       // CYRILLIC SMALL LETTER HA and SMALL LETTER U with DIERESIS 
                     "\u041C\u044C",       // CYRILLIC CAPITAL LETTER EM and SMALL LETTER SOFT SIGN
                     "\u043C\u044C",       // CYRILLIC SMALL LETTER EM and SMALL LETTER SOFT SIGN
                     "\u049A\u04F1",       // CYRILLIC CAPITAL LETTER KA with DESCENDER and SMALL LETTER U with DIERESIS
                     "\u049B\u04F1",       // CYRILLIC SMALL LETTER KA with DESCENDER and SMALL LETTER U with DIERESIS

                     "\u0418\u0304",       // CYRILLIC CAPITAL LETTER I with COMBINING MACRON
                     "\u0438\u0304",       // CYRILLIC SMALL LETTER I with COMBINING MACRON
                     "\u0410\u0304",       // CYRILLIC CAPITAL LETTER A with COMBINING MACRON
                     "\u0430\u0304",       // CYRILLIC SMALL LETTER A with COMBINING MACRON
                     "\u0041\u0304",       // LATIN CAPITAL LETTER A with COMBINING MACRON
                     "\u0061\u0304",       // LATIN SMALL LETTER A with COMBINING MACRON
                     "\u0423\u0304",       // CYRILLIC CAPITAL LETTER U with COMBINING MACRON
                     "\u0443\u0304",       // CYRILLIC SMALL LETTER U with COMBINING MACRON
                     "\u042E\u0304",       // CYRILLIC CAPITAL LETTER YU with COMBINING MACRON
                     "\u044E\u0304",       // CYRILLIC SMALL LETTER YU with COMBINING MACRON
                     "\u042F\u0304",       // CYRILLIC CAPITAL LETTER YA with COMBINING MACRON
                     "\u044F\u0304",       // CYRILLIC SMALL LETTER YA with COMBINING MACRON

                     "\u0418\u0308",       // CYRILLIC CAPITAL LETTER I with COMBINING DIERESIS
                     "\u0438\u0308",       // CYRILLIC SMALL LETTER I with COMBINING DIERESIS

                     "\u04E2",             // CYRILLIC CAPITAL LETTER I with MACRON
                     "\u04E3",             // CYRILLIC SMALL LETTER I with MACRON
                     "ā",
                     "\u0100",             // LATIN CAPITAL LETTER A with MACRON
                     "\u0101",             // LATIN SMALL LETTER A with MACRON
                     "\u04EE",             // CYRILLIC CAPITAL LETTER U with MACRON
                     "\u04EF",             // CYRILLIC SMALL LETTER U with MACRON
                     "\u042E",             // CYRILLIC CAPITAL LETTER YU
                     "\u044E",             // CYRILLIC SMALL LETTER YU
                     "\u042F",             // CYRILLIC CAPITAL LETTER YA
                     "\u044F",             // CYRILLIC SMALL LETTER YA

                     "\u0418",             // CYRILLIC CAPITAL LETTER I
                     "\u0438",             // CYRILLIC SMALL LETTER I
                     "\u0410",             // CYRILLIC CAPITAL LETTER A
                     "\u0430",             // CYRILLIC SMALL LETTER A
                     "\u0423",             // CYRILLIC CAPITAL LETTER U
                     "\u0443",             // CYRILLIC SMALL LETTER U
                     "\u042B",             // CYRILLIC CAPITAL LETTER YERU
                     "\u044B",             // CYRILLIC SMALL LETTER YERU

                     "\u04A2",             // CYRILLIC CAPITAL LETTER EN with DESCENDER
                     "\u04A3",             // CYRILLIC SMALL LETTER EN with DESCENDER
                     "\u04B2",             // CYRILLIC CAPITAL LETTER HA with DESCENDER
                     "\u04B3",             // CYRILLIC SMALL LETTER HA with DESCENDER
                     "\u04E4",             // CYRILLIC CAPITAL LETTER I with DIERESIS
                     "\u04E5",             // CYRILLIC SMALL LETTER I with DIERESIS
                     "\u04F0",             // CYRILLIC CAPITAL LETTER U with DIERESIS
                     "\u04F1",             // CYRILLIC SMALL LETTER U with DIERESIS
                     "\u04F6",             // CYRILLIC CAPITAL LETTER GHE with DESCENDER
                     "\u04F7",             // CYRILLIC SMALL LETTER GHE with DESCENDER
                     "\u041A",             // CYRILLIC CAPITAL LETTER KA
                     "\u043A",             // CYRILLIC SMALL LETTER KA
                     "\u041B",             // CYRILLIC CAPITAL LETTER EL
                     "\u043B",             // CYRILLIC SMALL LETTER EL
                     "\u041C",             // CYRILLIC CAPITAL LETTER EM
                     "\u043C",             // CYRILLIC SMALL LETTER EM
                     "\u041D",             // CYRILLIC CAPITAL LETTER EN
                     "\u043D",             // CYRILLIC SMALL LETTER EN
                     "\u041F",             // CYRILLIC CAPITAL LETTER PE
                     "\u043F",             // CYRILLIC SMALL LETTER PE
                     "\u049A",             // CYRILLIC CAPITAL LETTER KA with DESCENDER
                     "\u049B",             // CYRILLIC SMALL LETTER KA with ER
                     "\u0412",             // CYRILLIC CAPITAL LETTER VE
                     "\u0432",             // CYRILLIC SMALL LETTER VE
                     "\u0413",             // CYRILLIC CAPITAL LETTER GHE
                     "\u0433",             // CYRILLIC SMALL LETTER GHE
                     "\u0417",             // CYRILLIC CAPITAL LETTER ZE
                     "\u0437",             // CYRILLIC SMALL LETTER ZE
                     "\u0420",             // CYRILLIC CAPITAL LETTER ER
                     "\u0440",             // CYRILLIC SMALL LETTER ER
                     "\u0421",             // CYRILLIC CAPITAL LETTER ES
                     "\u0441",             // CYRILLIC SMALL LETTER ES
                     "\u0422",             // CYRILLIC CAPITAL LETTER TE
                     "\u0442",             // CYRILLIC SMALL LETTER TE
                     "\u0424",             // CYRILLIC CAPITAL LETTER EF
                     "\u0444",             // CYRILLIC SMALL LETTER EF
                     "\u0425",             // CYRILLIC CAPITAL LETTER HA
                     "\u0445",             // CYRILLIC SMALL LETTER HA
                     "\u0428",             // CYRILLIC CAPITAL LETTER SHA
                     "\u0448",             // CYRILLIC SMALL LETTER SHA
                     ]

    var punctuation = new Set(["'", '\u2019', '.', ',', '!', '?', ';', ':', '\u2500'])

    var result = []

    var start = 0
    var end = word.length

    while (start < end) {
        var found_grapheme = false
		
        for (var i = 0; i < graphemes.length; i++) {
            var grapheme = graphemes[i]
			
            if (word.slice(start, end).startsWith(grapheme)) {
                result.push(grapheme)
                start += grapheme.length
                found_grapheme = true
                break
            }
        }
		
        if (! found_grapheme) {
            var character = word.substring(start, start+1)
			
                if (isAlpha(character)) {
                    result.push(character)
                } else if (keep_punctuation && punctuation.has(character) || !isNaN(character)) {
                    result.push(character)
                } 

                start += 1
        }
    } // End 'while' Loop

    return result
}


// Undoes the Cyrillic orthography adjustments
function undo_cyrillic_adjustments(graphemes) {

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

    var undo_lzlls = {
        "\u044F\u0304":"\u0430\u0430",  // CYRILLIC SMALL LETTER YA with COMBINING MACRON to 'aa'
        "\u044F":"\u0430",              // CYRILLIC SMALL LETTER YA to 'a'
        "\u044E\u0304":"\u0443\u0443",  // CYRILLIC SMALL LETTER YA with COMBINING MACRON to 'uu'
        "\u044E":"\u0443",              // CYRILLIC SMALL LETTER YU to 'u'
    }

    // Moves labialization symbol, i.e. Small Letter U with Dieresis to post-consonant position
    var undo_labialC = {
        "\u043A":"\u043A\u04F1",             // CYRILLIC SMALL LETTER KA and SMALL LETTER U with DIERESIS
        "\u049B":"\u049B\u04F1",             // CYRILLIC SMALL LETTER KA with DESCENDER and SMALL LETTER U with DIERESIS 
        "\u04F7":"\u04F7\u04F1",             // CYRILLIC SMALL LETTER GHE with DESCENDER and SMALL LETTER U with DIERESIS 
        "\u0445":"\u0445\u04F1",             // CYRILLIC SMALL LETTER HA and SMALL LETTER U with DIERESIS
        "\u04B3":"\u04B3\u04F1",             // CYRILLIC SMALL LETTER HA with DESCENDER and SMALL LETTER U with DIERESIS
        "\u04A3":"\u04A3\u04F1",             // CYRILLIC SMALL LETTER EN with DESCENDER and SMALL LETTER U with DIERESIS
        "\u04A3\u044C":"\u04A3\u044C\u04F1", // CYRILLIC SMALL LETTER EN with DESCENDER & SMALL LETTER SOFT SIGN
                                             // & SMALL LETTER U with DIERESIS
    }

    var result = []

    for (var i = 0; i < graphemes.length; i++) {
        var grapheme = graphemes[i]

        // ADJUSTMENT 2: Delete the Cyrillic soft sign that is inserted between 'ya'/'yu' and a consonant
        if (i < graphemes.length - 1 && grapheme == "\u044C" && graphemes[i+1] in undo_lzlls) {
            result.push(graphemes[i+1])
            i++
        }

        // ADJUSTMENT 3: The 'ya', 'yu' Cyrillic representations are rewritten as 'a'
        // and 'u' if they follow the Cyrillic representations of 'l', 'z', 'll', 's'
        else if (i < graphemes.length - 1 && grapheme in lzlls && graphemes[i+1] in undo_lzlls) {
            result.push(grapheme, undo_lzlls[graphemes[i+1]])
            i++
        }
       
        // ADJUSTMENT - A labialization symbol that appears before the consonant
        // it labializes is moved to a position after the consonant
        else if (i < graphemes.length - 1 && grapheme == "\u04F1" && graphemes[i+1] in undo_labialC) {
            result.push(undo_labialC[graphemes[i+1]])
            i++
        }

        // No adjustments applicable
        else {
            result.push(grapheme)
        }
    }

    return result
}


// Transliterates Cyrillic graphemes to Latin graphemes
function cyrillic_to_latin(graphemes) {

    var vowels = {
        "\u0438":"i",               // CYRILLIC SMALL LETTER I 
        "\u0430":"a",               // CYRILLIC SMALL LETTER A
        "\u0443":"u",               // CYRILLIC SMALL LETTER U
        "\u044B":"e",               // CYRILLIC SMALL LETTER YERU

        "\u0418":"I",               // I to CYRILLIC CAPITAL LETTER I
        "\u0410":"A",               // A to CYRILLIC CAPITAL LETTER A
        "\u0423":"U",               // U to CYRILLIC CAPITAL LETTER U
        "\u042B":"E",               // E to CYRILLIC CAPITAL LETTER YERU

        "\u0438\u0304":"ii",        // CYRILLIC SMALL LETTER I with COMBINING MACRON
        "ā":"aa",
        "\u0430\u0304":"aa",        // CYRILLIC SMALL LETTER A with COMBINING MACRON 
        "\u0061\u0304":"aa",        // LATIN SMALL LETTER A with COMBINING MACRON
        "\u0443\u0304":"uu",        // CYRILLIC SMALL LETTER U with COMBINING MACRON 
        "\u04E3":"ii",              // CYRILLIC SMALL LETTER I with MACRON 
        "\u04EF":"uu",              // CYRILLIC SMALL LETTER U with MACRON 

        "\u04E2":"Ii",              // CYRILLIC CAPITAL LETTER I with MACRON
        "\u0410\u0304":"Aa",        // CYRILLIC CAPITAL LETTER A with MACRON
        "\u04EE":"Uu",              // CYRILLIC CAPITAL LETTER U with MACRON

        "\u044F":"ya",              // CYRILLIC SMALL LETTER YA
        "\u044E":"yu",              // CYRILLIC SMALL LETTER YU

        "\u042F":"Ya",              // CYRILLIC CAPITAL LETTER YA
        "\u042E":"Yu",              // CYRILLIC CAPITAL LETTER YU
 
        "\u044F\u0304":"yaa",       // CYRILLIC SMALL LETTER YA with MACRON
        "\u044E\u0304":"yuu",       // CYRILLIC SMALL LETTER YU with MACRON

        "\u042F\u0304":"Yaa",       // CYRILLIC CAPITAL LETTER YA with MACRON
        "\u042E\u0304":"Yuu",       // CYRILLIC CAPITAL LETTER YU with MACRON
    }

    var consonants= {
        // Stops                                                                                                                      
        "\u043F":"p",               // CYRILLIC SMALL LETTER PE
        "\u0442":"t",               // CYRILLIC SMALL LETTER TE
        "\u043A":"k",               // CYRILLIC SMALL LETTER KA
        "\u043A\u04F1":"kw",        // CYRILLIC SMALL LETTER KA and SMALL LETTER U with DIERESIS
        "\u049B":"q",               // CYRILLIC SMALL LETTER KA with DESCENDER
        "\u049B\u04F1":"qw",        // CYRILLIC SMALL LETTER KA with DESCENDER and SMALL LETTER U with DIERESIS 

        "\u041F":"P",               // CYRILLIC CAPITAL LETTER PE
        "\u0422":"T",               // CYRILLIC CAPITAL LETTER TE
        "\u041A":"K",               // CYRILLIC CAPITAL LETTER KA
        "\u041A\u04F1":"Kw",        // CYRILLIC CAPITAL LETTER KA and SMALL LETTER U with DIERESIS
        "\u049A":"Q",               // CYRILLIC CAPITAL LETTER KA with DESCENDER
        "\u049A\u04F1":"Qw",        // CYRILLIC CAPITAL LETTER KA with DESCENDER and SMALL LETTER U with DIERESIS

        // Voiced fricatives                                                                                                          
        "\u0432":"v",              // CYRILLIC SMALL LETTER VE
        "\u043B":"l",              // CYRILLIC SMALL LETTER EL
        "\u0437":"z",              // CYRILLIC SMALL LETTER ZE
        "\u0438\u0308":"y",        // CYRILLIC SMALL LETTER I with COMBINING DIERESIS
        "\u04E5":"y",              // CYRILLIC SMALL LETTER I with DIERESIS
        "\u0440":"r",              // CYRILLIC SMALL LETTER ER
        "\u0433":"g",              // CYRILLIC SMALL LETTER GHE
        "\u04F1":"w",              // CYRILLIC SMALL LETTER U with DIERESIS 
        "\u04F7":"gh",             // CYRILLIC SMALL LETTER GHE with DESCENDER
        "\u04F7\u04F1":"ghw",      // CYRILLIC SMALL LETTER GHE with DESCENDER and SMALL LETTER U with DIERESIS 

        "\u0412":"V",              // CYRILLIC CAPITAL LETTER VE
        "\u041B":"L",              // CYRILLIC CAPITAL LETTER EL
        "\u0417":"Z",              // CYRILLIC CAPITAL LETTER ZE
        "\u0418\u0308":"Y",        // CYRILLIC CAPITAL LETTER I with COMBINING DIERESIS
        "\u04E4":"Y",              // CYRILLIC CAPITAL LETTER I with DIERESIS
        "\u0420":"R",              // CYRILLIC CAPITAL LETTER ER
        "\u0413":"G",              // CYRILLIC CAPITAL LETTER GHE
        "\u04F0":"W",              // CYRILLIC CAPITAL LETTER U with DIERESIS 
        "\u04F6":"Gh",             // CYRILLIC CAPITAL LETTER GHE with DESCENDER
        "\u04F6\u04F1":"Ghw",      // CYRILLIC CAPITAL LETTER GHE with DESCENDER

        // Voiceless fricatives                                                                                                       
        "\u0444":"f",             // CYRILLIC SMALL LETTER EF
        "\u043B\u044C":"ll",      // CYRILLIC SMALL LETTER EL and SMALL LETTER SOFT SIGN
        "\u0441":"s",             // CYRILLIC SMALL LETTER ES
        "\u0448":"rr",            // CYRILLIC SMALL LETTER SHA
        "\u0445":"gg",            // CYRILLIC SMALL LETTER HA
        "\u0445\u04F1":"wh",      // CYRILLIC SMALL LETTER HA and SMALL LETTER U with DIERESIS
        "\u04B3":"ghh",           // CYRILLIC SMALL LETTER HA with DESCENDER
        "\u04B3\u04F1":"ghhw",    // CYRILLIC SMALL LETTER HA with DESCENDER and SMALL LETTER U with DIERESIS

        "\u0444":"F",             // CYRILLIC CAPITAL LETTER EF
        "\u041B\u044C":"Ll",      // CYRILLIC CAPITAL LETTER EL and SMALL LETTER SOFT SIGN
        "\u0421":"S",             // CYRILLIC CAPITAL LETTER ES
        "\u0428":"Rr",            // CYRILLIC CAPITAL LETTER SHA 
        "\u0425":"Gg",            // CYRILLIC CAPITAL LETTER HA 
        "\u0425":"Gg",            // CYRILLIC CAPITAL LETTER HA 
        "\u0425\u04F1":"Wh",      // CYRILLIC CAPITAL LETTER HA and SMALL LETTER U with DIERESIS 
        "\u04B2":"Ghh",           // CYRILLIC CAPITAL LETTER HA with DESCENDER 
        "\u04B2\u04F1":"Ghhw",    // CYRILLIC CAPITAL LETTER HA with DESCENDER and SMALL LETTER U with DIERESIS 
        "\u0413":"H",             // CYRILLIC CAPITAL LETTER GHE

        // Voiced nasals                                                                                                              
        "\u043C":"m",              // CYRILLIC SMALL LETTER EM
        "\u043D":"n",              // CYRILLIC SMALL LETTER EN
        "\u04A3":"ng",             // CYRILLIC SMALL LETTER EN with DESCENDER
        "\u04A3\u04F1":"ngw",      // CYRILLIC SMALL LETTER EN with DESCENDER and SMALL LETTER U with DIERESIS

        "\u041C":"M",              // CYRILLIC CAPITAL LETTER EM
        "\u041D":"N",              // CYRILLIC CAPITAL LETTER EN
        "\u04A2":"Ng",             // CYRILLIC CAPITAL LETTER EN with DESCENDER
        "\u04A2\u04F1":"Ngw",      // CYRILLIC CAPITAL LETTER EN with DESCENDER and SMALL LETTER U with DIERESIS

        // Voiceless nasals                                                                                                           
        "\u043C\u044C":"mm",          // CYRILLIC SMALL LETTER EM and SMALL LETTER SOFT SIGN
        "\u043D\u044C":"nn",          // CYRILLIC SMALL LETTER EN and SMALL LETTER SOFT SIGN
        "\u04A3\u044C":"ngng",        // CYRILLIC SMALL LETTER EN with DESCENDER and SMALL LETTER SOFT SIGN
        "\u04A3\u044C\u04F1":"ngngw", // CYRILLIC SMALL LETTER EN with DESCENDER & SMALL LETTER SOFT SIGN & SMALL LETTER U with DIERESIS

        "\u041C\u044C":"Mm",          // CYRILLIC CAPITAL LETTER EM and SMALL LETTER SOFT SIGN
        "\u041D\u044C":"Nn",          // CYRILLIC CAPITAL LETTER EN and SMALL LETTER SOFT SIGN
        "\u04A2\u044C":"Ngng",        // CYRILLIC CAPITAL LETTER EN with DESCENDER and SMALL LETTER SOFT SIGN
        "\u04A2\u044C\u04F1":"Ngngw", // CYRILLIC CAPITAL LETTER EN with DESCENDER & SMALL LETTER SOFT SIGN & SMALL LETTER U with DIERESIS
    }   

    var result = []

    for (var i = 0; i < graphemes.length; i++) {
        var grapheme = graphemes[i]

        if (grapheme in vowels) {
            result.push(vowels[grapheme])
        } else if (grapheme in consonants) {
            result.push(consonants[grapheme])
        } else {
            result.push(grapheme)
        }
    }

    word = tokens_to_string(undouble(result))
    return spellcheck_cyr(word)
}


// Applies the Latin orthographic undoubling rules, i.e. undoubles the graphemes that are underlyingly voiceless
function undouble(graphemes) {

    var doubled_fricative    = new Set(['ll', 'rr', 'gg', 'ghh', 'ghhw'])
    var doubled_nasal     = new Set(['nn', 'mm', 'ngng', 'ngngw'])

    var doubleable_fricative = new Set(['l', 'r', 'g', 'gh', 'ghw'])

    var undoubleable_unvoiced_consonant = new Set(['p', 't', 'k', 'kw', 'q', 'qw', 'f', 's', 'wh'])

    var undouble={'ll'  : 'l',
                  'rr'  : 'r',
                  'gg'  : 'g',
                  'ghh' : 'gh',
                  'ghhw': 'ghw',
                  'nn'  : 'n',
                  'mm'  : 'm',
                  'ngng' : 'ng',
                  'ngngw': 'ngw'}

    var result = graphemes.slice(0) // Copy the list of graphemes

    var i = 0

    while (i+1 < result.length) {
        var first = result[i]
        var second = result[i+1]
	
        // Rule 1a                                                                                                                        
        if (doubled_fricative.has(first) && undoubleable_unvoiced_consonant.has(second)) {
            result[i] = undouble[first]
            i += 2
        }
        // Rule 1b                                                                                                                        
        else if (undoubleable_unvoiced_consonant.has(first) && doubled_fricative.has(second)) {
            result[i+1] = undouble[second]
            i += 2
        }
        // Rule 2                                                                                                                         
        else if (undoubleable_unvoiced_consonant.has(first) && doubled_nasal.has(second)) {
            result[i+1] = undouble[second]
            i += 2
        }
        // Rule 3a                                                                                                                        
        else if (doubled_fricative.has(first) && (doubled_fricative.has(second) || doubled_nasal.has(second))) {
            result[i+1] = undouble[second]
            i += 2
        }
        // Rule 3b                                                                                                                        
        else if ((doubled_fricative.has(first) || doubled_nasal.has(first)) && second=='ll') {
            result[i] = undouble[first]
            i += 2
        } 
        else {
            i += 1	
        }
    } // End 'while' Loop
	
    return result
}


function spellcheck_cyr(word) {

    var rewriteH = {"aagaaleketiiq":"aahaaleketiiq",
                    "aagaangwliq":"aahaangwliq",
                    "agaa":"ahaa",
                    "agaam":"ahaam",
                    "agaamangam":"ahaamangam",
                    "agaaw":"ahaaw",
                    "agay":"ahay",
                    "gaam":"haam",
                    "gaamangam":"haamangam",
                    "gaanta":"haanta",
                    "gaatwarae":"haatwarare",
                    "gaaw":"haaw",
                    "gay":"hay",
                    "geng":"heng",
                    "guk":"huk",
                    "guusae":"huusae",
                    "guuy":"huuy",
                    "iьi":"ihi",
                    "iьiьiьiy":"ihihihiy",
                    "iьiьiьiyagh":"ihihihiyagh",
                    "iьik":"ihik",
                    // "sааpghanghilnguq":"saaphanghilnguq",
                    "uuьuk":"uuhuk",
                    "uuьuuk":"uuhuuk",
                    "wuguguguguu":"wuhuhuhuhuu",
                    }

    if (word in rewriteH) {
        return tokenize_cyr(rewriteH[word])
    } else {
        return tokenize_cyr(word)
    }
}
