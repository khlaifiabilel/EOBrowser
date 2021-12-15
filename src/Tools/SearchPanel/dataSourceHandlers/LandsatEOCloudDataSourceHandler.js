import React from 'react';
import LandsatDataSourceHandler from './LandsatDataSourceHandler';
import { LandsatEOCloudTooltip } from './DatasourceRenderingComponents/dataSourceTooltips/LandsatTooltip';
import {
  DATASET_EOCLOUD_LANDSAT5,
  DATASET_EOCLOUD_LANDSAT7,
  DATASET_EOCLOUD_LANDSAT8,
} from '@sentinel-hub/sentinelhub-js';
import { ESA_L5, ESA_L7, ESA_L8 } from './dataSourceConstants';
import { DATASOURCES } from '../../../const';

export default class LandsatEOCloudDataSourceHandler extends LandsatDataSourceHandler {
  datasource = DATASOURCES.EOCLOUD_LANDSAT;
  searchGroupLabel = 'Landsat (ESA Archive)';
  searchGroupKey = 'landsat-eocloud';

  knownDatasets = [
    { shDataset: DATASET_EOCLOUD_LANDSAT5, datasetId: ESA_L5, urlId: 'ESA5' },
    { shDataset: DATASET_EOCLOUD_LANDSAT7, datasetId: ESA_L7, urlId: 'ESA7' },
    { shDataset: DATASET_EOCLOUD_LANDSAT8, datasetId: ESA_L8, urlId: 'ESA8' },
  ];

  getDataSourceTooltip() {
    return <LandsatEOCloudTooltip />;
  }

  groupChannels = () => {};
}
