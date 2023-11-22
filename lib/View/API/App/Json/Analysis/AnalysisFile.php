<?php
/**
 * Created by PhpStorm.
 * @author hashashiyyin domenico@translated.net / ostico@gmail.com
 * Date: 13/11/23
 * Time: 19:11
 *
 */

namespace API\App\Json\Analysis;

use JsonSerializable;

class AnalysisFile implements MatchContainerInterface, JsonSerializable {

    /**
     * @var int
     */
    protected $id = null;
    /**
     * @var int
     */
    protected $file_part_id;
    /**
     * @var string
     */
    protected $name = "";

    /**
     * @var AnalysisMatch[]
     */
    protected $matches = [];
    /**
     * @var string
     */
    protected $original_name;
    /**
     * @var string|null
     */
    protected $id_file_part;

    public function __construct( $id, $id_file_part, $name, $original_name ) {
        $this->id            = (int)$id;
        $this->id_file_part  = $id_file_part;
        $this->name          = $name;
        $this->original_name = $original_name;
        foreach ( MatchConstants::$forValue as $matchType ) {
            $this->matches[ $matchType ] = AnalysisMatch::forName( $matchType );
        }
    }

    public function jsonSerialize() {
        return [
                'id'            => $this->id,
                'id_file_part'  => $this->id_file_part,
                'name'          => $this->name,
                'original_name' => $this->original_name,
                'matches'       => array_values( $this->matches )
        ];
    }

    /**
     * @return int
     */
    public function getId() {
        return $this->id;
    }

    /**
     * @return AnalysisMatch
     */
    public function getMatch( $matchName ) {
        return $this->matches[ $matchName ];
    }

    /**
     * @return string
     */
    public function getName() {
        return $this->name;
    }

}