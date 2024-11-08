import React, {useMemo} from 'react';
import styles from './styles.module.css';

const BASE_URL_SPEAKER_DECK = 'https://speakerdeck.com/player/'

/** SpeakerDeck埋め込み部品の引数の型 */
type SpeakerDeckProps = {
    /** スライドのID */
    slideId: string;
    /** 開始位置(任意) */
    page?: number;
}

/**
 * SpeakerDeck埋め込み用部品.以下例.
 * 
 * import {SpeakerDeck} from '@site/src/components/Embedded';
 * <SpeakerDeck slideId="522ae7bf572044a8898a6b6449e05540"  page={10} />
 * 
 */
export const SpeakerDeck: React.FC<SpeakerDeckProps> = ({slideId, page}, ) => {
    const url = useMemo(() => {
        let temp = BASE_URL_SPEAKER_DECK + slideId
        if (page !== undefined) {
            temp += '?slide=' + page;
        }
        return temp;
    }, [slideId, page]);
  
    return (
      <div className={styles.speakerDeckContainer}>
          <iframe src={url} allow={"fullscreen"} className={styles.speakerDeckContent} />
      </div>
    );
  };
  