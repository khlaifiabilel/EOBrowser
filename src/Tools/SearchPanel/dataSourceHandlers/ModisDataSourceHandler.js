import React from 'react';
import { DATASET_MODIS, MODISLayer } from '@sentinel-hub/sentinelhub-js';
import { t } from 'ttag';

import DataSourceHandler from './DataSourceHandler';
import GenericSearchGroup from './DatasourceRenderingComponents/searchGroups/GenericSearchGroup';
import ModisTooltip from './DatasourceRenderingComponents/dataSourceTooltips/ModisTooltip';
import { FetchingFunction } from '../search';
import { MODIS } from './dataSourceConstants';
import { DATASOURCES } from '../../../const';

export default class ModisDataSourceHandler extends DataSourceHandler {
  KNOWN_BANDS = [
    {
      name: 'B01',
      getDescription: () => t`Red band`,
    },
    {
      name: 'B02',
      getDescription: () => t`841 - 876 nm (NIR)`,
    },
    {
      name: 'B03',
      getDescription: () => t`Blue band`,
    },
    {
      name: 'B04',
      getDescription: () => t`Green band`,
    },
    {
      name: 'B05',
      getDescription: () => t`1230 - 1250 nm`,
    },
    {
      name: 'B06',
      getDescription: () => t`1628 - 1652 nm`,
    },
    {
      name: 'B07',
      getDescription: () => t`2105 - 2155 nm`,
    },
  ];
  urls = [];
  configs = {};
  datasets = [];
  preselectedDatasets = new Set();
  searchFilters = {};
  preselected = false;
  isChecked = false;
  datasource = DATASOURCES.MODIS;

  leafletZoomConfig = {
    [MODIS]: {
      min: 7,
      max: 18,
    },
  };

  willHandle(service, url, name, layers, preselected) {
    const usesDataset = !!layers.find((l) => l.dataset && l.dataset.id === DATASET_MODIS.id);
    if (!usesDataset) {
      return false;
    }
    this.datasets.push(MODIS);
    this.preselected |= preselected;
    this.urls.push(url);
    this.saveFISLayers(url, layers);
    return true;
  }

  isHandlingAnyUrl() {
    return this.urls.length > 0;
  }

  getSearchFormComponents() {
    if (!this.isHandlingAnyUrl()) {
      return null;
    }
    return (
      <GenericSearchGroup
        key={`modis`}
        label="MODIS"
        preselected={this.preselected}
        saveCheckedState={this.saveCheckedState}
        dataSourceTooltip={<ModisTooltip />}
        saveFiltersValues={this.saveSearchFilters}
        options={[]}
        preselectedOptions={Array.from(this.preselectedDatasets)}
        hasMaxCCFilter={false}
      />
    );
  }

  getNewFetchingFunctions(fromMoment, toMoment, queryArea = null) {
    if (!this.isChecked) {
      return [];
    }

    let fetchingFunctions = [];

    // instanceId and layerId are required parameters, although we don't need them for findTiles
    const searchLayer = new MODISLayer({ instanceId: true, layerId: true });
    const ff = new FetchingFunction(
      MODIS,
      searchLayer,
      fromMoment,
      toMoment,
      queryArea,
      this.convertToStandardTiles,
    );
    fetchingFunctions.push(ff);
    return fetchingFunctions;
  }

  convertToStandardTiles = (data, datasetId) => {
    const tiles = data.map((t) => ({
      sensingTime: t.sensingTime,
      geometry: t.geometry,
      datasource: this.datasource,
      datasetId,
      metadata: {}, // MODIS had cloudCoveragePercentage, but it's always 0%
    }));
    return tiles;
  };

  getUrlsForDataset = () => {
    return this.urls;
  };

  getBands = () => {
    return this.KNOWN_BANDS;
  };

  getSentinelHubDataset = () => {
    return DATASET_MODIS;
  };

  getResolutionLimits() {
    return { resolution: 500 };
  }

  supportsInterpolation() {
    return true;
  }
}
