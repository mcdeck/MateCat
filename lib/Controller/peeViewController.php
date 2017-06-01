<?php

class peeViewController extends viewController {

    /**
     * Data field filled to display in the template
     * @var array
     */
    protected $dataLangStats = [];

    /**
     * @var array
     */
    protected $snapshots = [];

    /**
     * @var DateTime
     */
    protected $filterDate = null;

    public function __construct() {
        parent::__construct();
        parent::makeTemplate( "pee.html" );

        $filterArgs = [
                'date'      => [
                        'filter' => FILTER_SANITIZE_STRING, 'flags' => FILTER_FLAG_STRIP_LOW | FILTER_FLAG_STRIP_HIGH
                ],
        ];

        $__postInput = filter_input_array( INPUT_POST, $filterArgs );

        if( $__postInput[ 'date' ] != null ){
            try {
                $this->filterDate = new DateTime( $__postInput[ 'date' ] );
            } catch( Exception $e ){}
        }

    }

    public function doAction() {

        $languageStats = ( new LanguageStats_LanguageStatsDAO() )->getLanguageStats( $this->filterDate );
        $languages_instance = Langs_Languages::getInstance();

        $this->snapshots = ( new LanguageStats_LanguageStatsDAO() )->getSnapshotDates();

        if ( !empty( $languageStats ) ) {
            $this->dataLangStats = [];
        } else {
            $this->dataLangStats[] = [
                    "source"       => null,
                    "target"       => null,
                    "pee"          => 0,
                    "fuzzy_band"   => null,
                    "totalwordPEE" => null,
                    "job_count"    => null
            ];
        }

        foreach ( $languageStats as $k => $value ) {
            $this->dataLangStats[] = [
                    "source"       => $languages_instance->getLocalizedName( $value[ 'source' ] ),
                    "target"       => $languages_instance->getLocalizedName( $value[ 'target' ] ),
                    "pee"          => $value[ 'total_post_editing_effort' ],
                    "fuzzy_band"   => $value[ 'fuzzy_band' ],
                    "totalwordPEE" => number_format( $value[ 'total_word_count' ], 0, ",", "." ),
                    "payable_rate" => Analysis_PayableRates::pee2payable( $value[ 'total_post_editing_effort' ] ),
                    "job_count"    => $value[ 'job_count' ]
            ];
        }

    }

    public function setTemplateVars() {
        $this->template->dataLangStats = json_encode( $this->dataLangStats );
        $selectedDate = ( $this->filterDate ? $this->filterDate->format( 'Y-m-d H:i:s' ) : null );
        foreach( $this->snapshots as &$date ){
            $date[ 'selected' ] = false;
            if( $date[ 'date' ] == $selectedDate ){
                $date[ 'selected' ] = true;
            }
        }
        $this->template->snapshots = $this->snapshots;
        $this->template->lastMonth = end( $this->snapshots )[ 'date' ];
    }
}